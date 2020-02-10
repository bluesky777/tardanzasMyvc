angular.module('starter.controllers')


.controller('VerCambiosHechosCtrl', function($scope, ConexionServ, $http, $state, $ionicPopup, Auth, $ionicLoading, $timeout, $ionicActionSheet, DB_Local) {

  $scope.ConexionServ = ConexionServ;
  $scope.USER = Auth.get();
  $scope.alumnos_cambiados = [];

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


  $scope.refrescar = function(){

    consul_alum = "SELECT m.alumno_id, au.rowid, au.uploaded, a.nombres, a.apellidos, au.fecha_hora, g.nombre as nombre_grupo, g.abrev as abrev_grupo" +
                  " FROM ausencias au " + 
                  "INNER JOIN alumnos a ON a.id=au.alumno_id " +
                  "INNER JOIN matriculas m ON m.alumno_id=a.id " +
                  "INNER JOIN grupos g ON g.id=m.grupo_id and g.year_id=?" +
                  "WHERE (au.uploaded='to_create' or au.uploaded='to_delete') and au.entrada=1 " +
                  "ORDER BY m.alumno_id";

    ConexionServ.query(consul_alum, [$scope.USER.year_id]).then(function(r){
      for (var i = 0; i < r.length; i++) {
        r[i].fecha_hora = new Date(r[i].fecha_hora);
      }
      $scope.alumnos_cambiados = r;
      $scope.$broadcast('scroll.refreshComplete');
    });

  }

  $scope.refrescar();





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

              DB_Local.eliminarAusencia(ausencia).then(function(){
                  $scope.refrescar();
              })


          } // onTap
        } //bt2
      ] // buttons
    }); // MyPopup si quiere conectarse al servidor


  }


  $scope.restore = function(ausencia, indice){


    myPopup = $ionicPopup.show({
      title: '¿Seguro que quiere volver a dejar la ausencia?',
      scope: $scope,
      buttons: [
        {
          text: '<b>No</b>',
          type: 'button-stable',
                
        },
        {
          text: '<b>Si</b>',
          type: 'button-assertive',
          onTap: function(e) {

              DB_Local.setUploadedAusenciaTo(ausencia, 'created').then(function(){
                  $scope.refrescar();
              })


          } // onTap
        } //bt2
      ] // buttons
    }); // MyPopup si quiere conectarse al servidor


      


  }


})
