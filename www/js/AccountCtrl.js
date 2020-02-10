angular.module('starter.controllers')


.controller('AccountCtrl', function($scope, ConexionServ, $http, $state, $ionicPopup, Auth, $ionicLoading, $timeout, $ionicActionSheet) {
  $scope.USER = Auth.get();
  $scope.ConexionServ = ConexionServ;

  $scope.settings = {
    enableFriends: true
  };

  $scope.trabajar_sin_conexion = true;
  /*
  if (localStorage.trabajar_sin_conexion) {
    $scope.trabajar_sin_conexion = (localStorage.trabajar_sin_conexion == 'true');
  }else{
    $scope.trabajar_sin_conexion = false;
  }
  */


  $scope.toggle_trabajar_sin_conexion = function(trabajar_sin) {
    localStorage.trabajar_sin_conexion = trabajar_sin;
  };


  $scope.triggerActionSheetTraer = function() {

      // Show the action sheet
      var showActionSheet = $ionicActionSheet.show({
         buttons: [
            { text: '<b>Todo</b>' },
            { text: 'Solo ausencias' },
         ],
         titleText: 'Reiniciar datos:',
         cancelText: 'Cancelar',

         cancel: function() {
            // add cancel code...
         },

         buttonClicked: function(index) {
          if(index === 0) {
            $scope.reiniciarDatosTodo();
          }
          if(index === 1) {
            $scope.reiniciarDatosAusencias();
          }
          return true;
         }
      });
  };
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>  Cargando...',
    }).then(function(){
       console.log("Mostrando loading");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("Loading ocultado");
    });
  };


  $scope.actualizarUsuarioActual = function(){
    $scope.show();
    Auth.actualizarStorage().then(function(r_act){
      console.log(r_act);
      $scope.hide();
      $state.reload();

    }); // Auth.actualizarStorage();
  };

  $scope.subirCambios = function(){
    $scope.show();
    cons = "SELECT * FROM ausencias a WHERE a.uploaded=? or a.uploaded=?";
    ConexionServ.query(cons, ['to_create', 'to_delete']).then(function(r){
      ausencias_to_create = r;

      datos = { username: localStorage.username, password: localStorage.password, ausencias_to_create: ausencias_to_create }

      $http.post(ConexionServ.geturl() + 'subir', datos).then(function(r){
        $scope.hide();
        $ionicPopup.alert({
           title: 'Éxito',
           template: 'Datos subidos.'
        }).then(function(){
          $scope.reiniciarDatosAusenciasExec();
        });
      }, function (r2) {
        $scope.hide();
        $ionicPopup.alert({
           title: 'Error subiendo datos',
           template: 'Por favor intente de nuevo'
        });
      });

    }); // ConexionServ.query SELECT ALUMNOS
  };

  $scope.crearTablas = function(){
    ConexionServ.createTables().then(function(r){
      var pupTra = $ionicPopup.alert({
         title: 'Tablas creadas',
         template: 'Las tablas han sido creadas'
      }); // pupTra
    }, function(r2){
      var pupTra = $ionicPopup.alert({
         title: 'No se puede',
         template: 'Tal vez las tablas ya están creadas'
      }); // pupTra
    });
  }

  $scope.reiniciarDatosTodo = function(){
    alertPopup = $ionicPopup.confirm({
         title: '¿Borrar base de datos?',
         template: 'Los cambios que NO hayas subido al servidor se perderán',
         buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Reiniciar</b>',
            type: 'button-positive',
            onTap: function(e) {
                $scope.show();
                ConexionServ.deleteTables().then(function(r){
                  ConexionServ.createTables().then(function(r){


                    loginData           = Auth.loginData();
                    loginData.year_id   = $scope.USER.year_id;

                    ConexionServ.trayendoDatos(loginData).then(function(user){

                      $timeout(function(){
                        Auth.actualizarStorage().then(function(r_act){
                          console.log(r_act);
                          $scope.hide();
                          var pupTra = $ionicPopup.alert({
                             title: 'Datos traídos',
                             template: 'Las tablas han sido reiniciadas'
                          }); // pupTra

                          pupTra.then(function(){
                             $timeout(function(){
                                $scope.actualizarUsuarioActual();
                              }, 2000); // timeout 2
                          })

                        }); // Auth.actualizarStorage();

                      }, 2000); // timeout


                    }, function(r2){
                      console.log('No se pudo traer los datos');
                      $scope.hide();
                      Auth.actualizarStorage();
                    }) // ConexionServ.trayendoDatos


                  }, function(){
                    $scope.hide();
                    var pupTra = $ionicPopup.alert({
                       title: 'Error creando tablas',
                       template: 'Por favor vuelva a intentarlo.'
                    });
                    Auth.actualizarStorage();
                  }); //ConexionServ.createTables
                }, function(){
                  $scope.hide();
                  var pupTra = $ionicPopup.alert({
                     title: 'Error eliminando tablas',
                     template: 'Recuerde que primero tiene que haberlas creado'
                  });
                }); // ConexionServ.deleteTables



            } // onTap button1
          } // button1
        ]
    }); // alertPopup
  }

  $scope.reiniciarDatosAusencias = function(){
    alertPopup = $ionicPopup.confirm({
         title: '¿Borrar tabla ausencias?',
         template: 'Las ausencias NO subidas, se perderán',
         buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Reiniciar</b>',
            type: 'button-positive',
            onTap: function(e) {

                $scope.reiniciarDatosAusenciasExec();

            } // onTap button1
          } // button1
        ]
    }); // alertPopup
  }

  $scope.verCambiosHechos = function(){
    $state.go('tab.ver-cambios-hechos');
  }

  $scope.reiniciarDatosAusenciasExec = function(){

    $scope.show();
    ConexionServ.deleteTableAusencias().then(function(r){
      ConexionServ.createTableAusencias().then(function(r2){

        loginData           = Auth.loginData();
        loginData.year_id   = $scope.USER.year_id;

        ConexionServ.trayendoDatosAusencias(loginData).then(function(r3){

          $timeout(function(){

              $scope.hide();
              $ionicPopup.alert({
                 title: 'Ausencias traídas',
                 template: 'La tabla ha sido reiniciada.'
              }); // pupTra

          }, 1000); // timeout


        }, function(r2){
          console.log('No se pudo traer las ausencias');
          $scope.hide();
        }) // ConexionServ.trayendoDatos


      }, function(){
        $scope.hide();
        var pupTra = $ionicPopup.alert({
           title: 'Error creando tabla ausencias',
           template: 'Por favor vuelva a intentarlo.'
        });
      }); //ConexionServ.createTables
    }, function(){
      $scope.hide();
      var pupTra = $ionicPopup.alert({
         title: 'Error eliminando tabla ausencias',
         template: 'Recuerde que primero tiene que haberla creado.'
      });
    }); // ConexionServ.deleteTables

  }

  $scope.cerrarSesion = function(){
    localStorage.removeItem('password');
    localStorage.removeItem('USER');
    $state.go('login');
  }

  $scope.doLogin = function(){
    $http.post(ConexionServ.geturl() + 'login', $scope.loginData).then(function(r){

      r         = r.data
      alumnos   = r.alumnos
      matriculas  = r.matriculas
      periodos  = r.periodos
      grupos    = r.grupos
      profesores  = r.profesores
      years     = r.years

      // Alumnos
      for (var i = 0; i < alumnos.length; i++) {
        ConexionServ.insertAlumno(alumnos[i]);
      }
      // Matriculas
      for (var i = 0; i < matriculas.length; i++) {
        ConexionServ.insertMatricula(matriculas[i]);
      }
      // Periodos
      for (var i = 0; i < periodos.length; i++) {
        ConexionServ.insertPeriodo(periodos[i]);
      }
      // grupos
      for (var i = 0; i < grupos.length; i++) {
        ConexionServ.insertGrupo(grupos[i]);
      }
      // profesores
      for (var i = 0; i < profesores.length; i++) {
        ConexionServ.insertProfesor(profesores[i]);
      }
      // years
      for (var i = 0; i < years.length; i++) {
        ConexionServ.insertYear(years[i]);
      }
      // Usuario
      ConexionServ.insertUser(r);


      Auth.actualizarStorage().then(function(r){
        $state.go('tab.dash')
      }, function(r2){
        console.log('No se actualizarStorage', r2);
      })






    }, function(r2){

      var alertPopup = $ionicPopup.alert({
         title: 'Inválido!',
         template: 'Tus datos no son correctos'
      });
    })
  }


})
