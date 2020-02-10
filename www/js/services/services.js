angular.module('starter.services', [])

.factory('Auth', function(ConexionServ, $q) {

  return {
    set: function(user) {
      localStorage.USER = angular.toJson(user);
      return true;
    },
    actualizarStorage: function() {
      deferedStor = $q.defer();
      cons = 'SELECT id, username, password, sexo, nombres, apellidos, is_superuser, tipo, persona_id, periodo_id, numero_periodo, year_id, year FROM users';

      ConexionServ.query(cons).then(function(res){
        usuario = res[0];
        console.log(angular.toJson(usuario), res);
        localStorage.USER = angular.toJson(usuario);
        deferedStor.resolve(localStorage.USER);
      }, function(r2){
        console.log('Error actualizarStorage', r2);
        deferedStor.reject(r2.message);
      });

      return deferedStor.promise;
    },
    get: function() {
      if (localStorage.USER != 'undefined') {
         var User = window.localStorage.USER;
        User = angular.fromJson(User);
        return User;
      }else{
        return {}
      }

    },
    loginData: function() {

        loginData = {}
        loginData.username  = localStorage.username;
        loginData.password  = localStorage.password;

        return loginData;
    }
  };
})

.factory('toasty', function($ionicPopup) {

  return {
    show: function(msg, duracion, posicion) {
      if(window.plugin){
          if(window.plugin.toast){
              duracion = duracion || 3;
              posicion = posicion || 'bottom';
              $ionicPopup.show({template: msg});
          }
      }else{
        console.log(msg);
      }
      return true;
    }
  };
})

.directive('focusMe', ['$timeout', function($timeout){
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element){
      scope.$watch('trigger', function(value){
        if(value == true){
          element[0].focus();
          scope.trigger = false;
        }
      })
    }
  }
}])
