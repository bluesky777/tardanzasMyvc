angular.module('starter.controllers')


.controller('DetalleAlumnoCtrl', function($scope, ConexionServ, $http, $state, $ionicPopup, Auth, $ionicLoading, $timeout, DB_Local, DB_Nube) {

  $scope.ConexionServ = ConexionServ;
  $scope.USER         = Auth.get();
  $scope.alumno       = angular.fromJson(localStorage.alumno_detalle);


  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>  Cargando...',
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("Loading ocultado");
    });
  };


  for (var i = 0; i < $scope.alumno.ausencias.length; i++) {
    $scope.alumno.ausencias[i].fecha_hora = new Date($scope.alumno.ausencias[i].fecha_hora);
  }


  $scope.eliminar = function(ausencia, indice){

    myPopup = $ionicPopup.show({
      title: '¿Seguro que desea eliminar ausencia?',
      scope: $scope,
      buttons: [
        {
          text: '<b>No</b>',
          type: 'button-stable',
                
        },
        {
          text: '<b>Eliminar</b>',
          type: 'button-assertive',
          onTap: function(e) {

            if (ausencia.uploaded == 'to_create') {

              DB_Local.eliminarAusencia(ausencia).then(function(){
                  $scope.alumno.ausencias.splice(indice, 1);
                  localStorage.alumno_detalle = angular.toJson($scope.alumno);
              })

            }else if(ausencia.uploaded == 'created'){
              
              DB_Nube.eliminarAusencia(ausencia).then(function(){
                  
                ausencia.uploaded = 'to_delete';
                localStorage.alumno_detalle = angular.toJson($scope.alumno);

              }, function(){
                  
              })
              

            }


          } // onTap
        } //bt2
      ] // buttons
    }); // MyPopup si quiere conectarse al servidor




  }


  $scope.restore = function(ausencia, indice){


      DB_Local.setUploadedAusenciaTo(ausencia, 'created').then(function(){
          ausencia.uploaded = 'created';
          localStorage.alumno_detalle = angular.toJson($scope.alumno);
      })


  }



})
