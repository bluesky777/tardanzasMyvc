angular.module('starter.services')

.factory('DB_Nube', function($q, $http, $timeout, ConexionServ, toasty, Auth, $rootScope, $ionicPopup, DB_Local) {



	var trabajar_sin_conexion = (localStorage.trabajar_sin_conexion == 'true');




	if (trabajar_sin_conexion) {

		$ionicPopup.confirm({
				title: "Trabajar sin conexión",
				content: "Se guardarán los cambios en el dispositivo. Tendrás que subir cambios luego.",
				buttons: [
					{
						text: '<b>Aceptar</b>',
						type: 'button-positive'
					}
				] // buttons
		})



	}else{

		// Aquí el usuario quiere trabajar CON Internet, así que verifiquemos si hay:
		if(window.Connection) {
			if(navigator.connection.type == Connection.NONE) {
					$ionicPopup.confirm({
							title: "Sin internet",
							content: "¿Quieres trabajar sin conexión? (luego puedes cambiarlo en la pestaña 'Cuenta').",
							buttons: [
								{
									text: '<b>Si</b>',
									type: 'button-stable',
									onTap: function(){
										localStorage.trabajar_sin_conexion = true
									}
								},
								{
									text: '<b>No</b>',
									type: 'button-positive',
									onTap: function(){
										localStorage.trabajar_sin_conexion = false
									}
								} //bt2
							] // buttons
					})
			} else {
				$ionicPopup.confirm({
							title: "CON internet",
							content: "Los cambios se irán subiendo de inmediato.",
							buttons: [
								{
									text: '<b>Si</b>',
									type: 'button-stable'
								}
							] // buttons
					})
			}// if navigator.connection.type

		} // if window.Connection

	}


	var result = {


		eliminarAusencia: function(ausencia_id){
			var defered = $q.defer();

			if(trabajar_sin_conexion){

				DB_Local.setUploadedAusenciaTo(ausencia_id, 'to_delete').then(function(){
					toasty.show('Eliminado localmente', 'short', 'bottom');
					defered.resolve();
				}, function(r2){
					toasty.show('No se pudo eliminar localmente', 'short', 'bottom');
					defered.reject(r2);
				});


			}else{

				ausencia = { username: localStorage.username, password: localStorage.password, ausencia_id: ausencia_id };

				$http.put(ConexionServ.geturl() + 'subir/eliminar-ausencia', ausencia).then(function(r){

					DB_Local.updateAusencia(ausencia_id).then(function(){
						toasty.show('Eliminado en la nube y localmente', 'short', 'bottom');
						defered.resolve();
					}, function(r2){
						toasty.show('Eliminado en Nube, pero NO localmente', 'short', 'bottom');
						defered.reject(r2);
					});

					defered.resolve(r.data);

				}, function(r2){
					toasty.show('No se eliminó en la nube', 'short', 'bottom');
					defered.reject(r2);
				});

			} // if trabajar_sin_conexion


			return defered.promise;

		},



		insertAusencia: function(datos){
			var defered = $q.defer();

			if(trabajar_sin_conexion){
				datos.uploaded = 'to_create';

				DB_Local.insertAusencia(datos).then(function(){
					toasty.show('Creada localmente', 'short', 'bottom');
					defered.resolve();
				}, function(r2){
					toasty.show('No se pudo crear localmente', 'short', 'bottom');
					defered.reject(r2);
				});


			}else{
				datos.uploaded = 'created';

				datos.username = localStorage.username;
				datos.password = localStorage.password;

				$http.put(ConexionServ.geturl() + 'subir/poner-ausencia', datos).then(function(r){

					DB_Local.insertAusencia(r.data).then(function(){
						toasty.show('Creada en Nube y localmente', 'short', 'bottom');
						defered.resolve(r.data);
					}, function(r2){
						toasty.show('Creada en Nube pero NO localmente', 'short', 'bottom');
						defered.reject(r2);
					});


				}, function(r2){
					toasty.show('No se eliminó en la nube', 'short', 'bottom');
					defered.reject(r2);
				});

			} // if trabajar_sin_conexion


			return defered.promise;

		}

	}

	return result;

});
