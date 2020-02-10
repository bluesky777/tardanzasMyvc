angular.module('starter.controllers', [])

.controller('TabsCtrl', function($scope, $state, $ionicTabsDelegate, Auth, ConexionServ, $ionicPopup) {


	ConexionServ.createTables().then(function(r){

    }, function(r2){
      var pupTra = $ionicPopup.alert({
         title: 'No se puede',
         template: 'Tal vez las tablas ya están creadas'
      }); // pupTra
    });

})
.controller('DashCtrl', function($scope, $state, ConexionServ, Auth) {
	$scope.iniciar = function(){
		$scope.USER = Auth.get();
		ConexionServ.getYears().then(function(r){
			$scope.years = r;
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	$scope.iniciar();


})
.controller('DashPeriodosCtrl', function($scope, $stateParams, ConexionServ, Auth) {
	$scope.USER = Auth.get();
	ConexionServ.query('SELECT p.id, p.numero, p.year_id, y.year FROM periodos p INNER JOIN years y ON y.id=p.year_id WHERE p.year_id=' + $stateParams.year_id).then(function(r){
		$scope.periodos = r;
	});

	$scope.setPeriodo = function(periodo){
		sql = 'UPDATE users SET periodo_id=?, numero_periodo=?, year_id=?, year=? WHERE id=?';
		ConexionServ.query(sql, [periodo.id, periodo.numero, periodo.year_id, periodo.year, $scope.USER.id]).then(function(r){
			console.log('Cambiado', r);
			Auth.actualizarStorage().then(function(r2){
				$scope.USER = Auth.get();
			});
		});
	}
})


.controller('GruposCtrl', function($scope, ConexionServ, Auth) {
	$scope.USER = Auth.get();
	cons = 'SELECT * FROM grupos WHERE year_id=?';
	ConexionServ.query(cons, [$scope.USER.year_id]).then(function(r){
		$scope.grupos = r;
	});

})


