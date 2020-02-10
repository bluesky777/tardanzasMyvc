angular.module('starter.controllers')


.controller('LoginCtrl', function($scope, $ionicActionSheet, ConexionServ, $http, $state, $ionicPopup, Auth, $ionicLoading) {

	$scope.loginData = { no_cerrar: true }
	$scope.ConexionServ = ConexionServ;

	if (localStorage.username) {
		$scope.loginData.username = localStorage.username;
	}


  buttonsServs = [];

  buttonsServs = [
    { 'text': "bethel.micolevirtual.com" },
    { 'text': "cads.micolevirtual.com" },
    { 'text': "casb.micolevirtual.com" },
    { 'text': "caz.micolevirtual.com" },
    { 'text': "coab.micolevirtual.com" },
    { 'text': "coaf.micolevirtual.com" },
    { 'text': "lalvirtual.edu.co" },
    { 'text': "maranatha.micolevirtual.com" },
    { 'text': "comad.micolevirtual.com" },
    { 'text': "coljordan.micolevirtual.com" },
    { 'text': "instival.micolevirtual.com" }
  ]
/*
  $http.get('http://www.micolevirtual.com/app/listado_colegios.php').then(function(r){
    for (let index = 0; index < r.data.length; index++) {
      buttonsServs.push({ 'text': r.data[index] });
    }

	  if (window.location.protocol != 'file:') {
      buttonsServs.push({ text: 'localhost' });
    }
  }, function(){
	  if (window.location.protocol != 'file:') {
      buttonsServs.push({ text: 'localhost' });
    }
  });*/


	$scope.triggerActionSheet = function() {

			// Show the action sheet
			var showActionSheet = $ionicActionSheet.show({
				buttons: buttonsServs,
				titleText: 'Servidor',
				cancelText: 'Cancelar',

				cancel: function() {
						// add cancel code...
				},

				buttonClicked: function(index) {
					ConexionServ.set(buttonsServs[index].text);
					return true;
				}
			});
	};

	$scope.show = function() {
		$ionicLoading.show({
			template: 'Cargando...',
		}).then(function(){
			 console.log("Mostrando loading");
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide().then(function(){
			 console.log("Loading ocultado");
		});
	};

	$scope.doLogin = function(){

		$scope.show();
		localStorage.username = $scope.loginData.username.toLowerCase();
		localStorage.password = $scope.loginData.password;
		localStorage.no_cerrar = $scope.loginData.no_cerrar;

		//Primero verifico si esos datos concuerdan con los de la base local
		//sql = 'SELECT * FROM users WHERE username=? and password=?';
		sql = 'SELECT * FROM users WHERE username=? and password=?;';


		//ConexionServ.query(sql, [$scope.loginData.username.toLowerCase(), $scope.loginData.password]).then(function(r){
		ConexionServ.query(sql, [$scope.loginData.username, $scope.loginData.password]).then(function(r){


			/*
			$ionicPopup.alert({
				title: 'Dat',
				template: $scope.loginData.username.toLowerCase() + ' - ' + r.username  + ' - Igual: ' + (r.username == $scope.loginData.username.toLowerCase()) + ' - pass:  ' + $scope.loginData.password + ' - ' + r.password + ' - pass igual:  ' + ($scope.loginData.password == r.password)
			});*/

			if (r.length > 0) {
				$state.go('tab.dash');
				Auth.set(r[0]);
			}else{
				$scope.intentarPorServer();
			}
			$scope.hide();


		}, function(r2){
			console.log(r2);
			$scope.hide();
			$scope.intentarPorServer();
		}); // ConexionQuery


	}


	if (localStorage.no_cerrar) {
		if (localStorage.no_cerrar == 'true') {
			if (localStorage.password && localStorage.password!='undefined') {
				$scope.loginData.password = localStorage.password;
				$scope.doLogin();
			}
		}
	}


	$scope.intentarPorServer = function(){


		// Preguntamos si quiere conectarse al sevidor
		var myPopup = $ionicPopup.show({
			template: '¿Deseas conectarte con el servidor en internet?',
			title: 'Datos no concuerdan en tu dispositivo',
			scope: $scope,
			buttons: [
				{
		            text: '<b>No</b>',
		            type: 'button-stable',

	            },
	            {
					text: '<b>Login</b>',
					type: 'button-positive',
					onTap: function(e) {
						$scope.show();
						ConexionServ.login($scope.loginData).then(function(r){
							$scope.hide();
							usuario = {
								id: r.id,
								username: r.username,
								password: r.password,
								sexo: r.sexo,
								nombres: r.nombres,
								apellidos: r.apellidos,
								is_superuser: r.is_superuser,
								tipo: r.tipo,
								persona_id: r.persona_id,
								periodo_id: r.periodo_id,
								year_id: r.year_id
							}

							localStorage.USER = angular.toJson(usuario);
							$state.go('tab.account');

						}, function(r2){
							$scope.hide();
							var alertPopup = $ionicPopup.alert({
								 title: 'Inválido! ',
								 template: 'Tus datos no son correctos.',
							});
						}) // ConexionServ.login

					} // onTap
				} //bt2
			] // buttons
		}); // MyPopup si quiere conectarse al servidor

	}


})
