angular.module('starter.controllers')


.controller('GrupoAlumnosCtrl', function($scope, $stateParams, ConexionServ, Auth, MonthPicker, $ionicLoading, $timeout, $ionicScrollDelegate, $state, DB_Nube, DB_Local) {
	$scope.USER = Auth.get();

	ahora 					= new Date();

	$scope.year_mes 		= {year: ahora.getFullYear(), month: ahora.getMonth() };
	$scope.nombresMeses 	= ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiem','Octubre','Noviem','Diciemb'];
	$scope.diaSeleccionado 	= ahora.getDate();

	$scope.$parent.dato  	= {text_buscar: '', buscando: false};
	$scope.alumnos 			= [];
	$scope.focusOnTxtBuscar = false;



	$scope.nombreMes = function(monthNumber){
		return $scope.nombresMeses[monthNumber];
	}

	MonthPicker.init({
		maxMonthIndex: 11,
		title: 'Seleccione mes',
		cancelText: 'Cancelar',
		monthLabels: $scope.nombresMeses,
		minYear: 2000,
		maxYear: 2030,
		startingYear: $scope.year_mes.year
	});

	$scope.clickBuscar = function(){
		$scope.$parent.dato.buscando = true;
		$timeout(function(){
			$scope.focusOnTxtBuscar = true;
		});

	}

	$scope.verDetalles = function(alumno){
		localStorage.alumno_detalle = angular.toJson(alumno);
		$state.go('tab.detalle-alumno');
	}

	// Traemos los alumnos correspondientes a ese día
	$scope.seleccionarDia = function(dia) {
		$scope.$parent.dato.buscando = false;
		$scope.$parent.dato.text_buscar = '';

		if (dia) {
			$scope.diaSeleccionado 	= dia;
		}

        cons = "SELECT * FROM alumnos a INNER JOIN matriculas m ON a.id=m.alumno_id AND m.grupo_id=? AND (m.estado='MATR' OR m.estado='ASIS' OR m.estado='PREM') ";
		ConexionServ.query(cons, [$stateParams.grupo_id]).then(function(r){
			$scope.alumnos = r;

			angular.forEach($scope.alumnos, function(alumno, indice){
				$scope.ausenciasDeAlumno(alumno);
			})
			$scope.$broadcast('scroll.refreshComplete');
		}); // ConexionServ.query SELECT ALUMNOS
    }
    $scope.seleccionarDia($scope.diaSeleccionado);


    // Traer todas las ausencias de una alumno en este periodo
	$scope.ausenciasDeAlumno = function(alumno) { // Le asigno las ausencias al alumno por referencia

		db = ConexionServ.getDb();
		db.transaction(function (tx) {
			cons_aus = "SELECT rowid, * FROM ausencias a WHERE a.alumno_id=? and a.periodo_id=? and a.entrada=? and a.uploaded!='to_delete'";

	        tx.executeSql(cons_aus, [alumno.alumno_id, $scope.USER.periodo_id, 1], function (tx, result) { // $scope.USER.periodo_id, alumno.alumno_id
	          var items = [];
	          tardanza_actual = false;

	          for (i = 0, l = result.rows.length; i < l; i++) {
	            aus 		= result.rows.item(i);
	            fecha_sp 	= aus.fecha_hora.split('-');
	            aus.year 	= parseInt(fecha_sp[0]);
	            aus.mes 	= parseInt(fecha_sp[1]);
	            aus.dia 	= parseInt(fecha_sp[2].split(' ')[0]);
	            items.push(aus);

	            // Verificamos si entre las ausencias hay una tardanza de entrada en la fecha actual
	            if (parseInt(aus.entrada) == 1 && parseInt(aus.year) == parseInt($scope.year_mes.year) && parseInt(aus.mes) == (parseInt($scope.year_mes.month)+1) && parseInt(aus.dia) == parseInt($scope.diaSeleccionado) ) {
					tardanza_actual 		= aus.rowid;
	            	aus.tardanza_actual 	= true;
	            }
	          }

	          alumno.ausencias = items;
	          alumno.tardanza_entrada_id	= tardanza_actual;
	          $scope.$apply();
	        }, function(tx,error){
	          console.log(error.message, cons_aus);
	        }) // db.executeSql
	    }); // db.transaction

    }

	$scope.buttonDateClick = function() {
        MonthPicker.show(function(res) {
            $scope.year_mes = res;
            $scope.dias = $scope.getAllDaysInMonth($scope.year_mes.month);
        });
    }

    $scope.toggleTardanza = function(alumno){
    	$scope.show();

    	tardanza_id_temp = alumno.tardanza_entrada_id;

    	if (alumno.tardanza_entrada_id) {
    		alumno.tardanza_entrada_id = false;
    	}else{
    		alumno.tardanza_entrada_id = true;
    	}
    	if (tardanza_id_temp) {
    		// Ya Existe la ausencia, debo buscarla para saber si está en la nube o no.
    		angular.forEach(alumno.ausencias, function(ausencia, indice){
    			if (ausencia.rowid == tardanza_id_temp) {

    				if (ausencia.uploaded == 'to_create') {

    					DB_Local.eliminarAusencia(ausencia).then(function(){
    						$scope.ausenciasDeAlumno(alumno);
    					});

					}else{
						// Está en la nube, debo eliminarla
						DB_Nube.eliminarAusencia(tardanza_id_temp).then(function(){
    						$scope.ausenciasDeAlumno(alumno);
    					});

					} // ausencia.uploaded
    			} // ausencia.id == alumno.tardanza_entrada_id

			}) // forEach

    	}else{

    		// Si no tenía tardanza_id_temp, es porque no existía, así que creamos la tardanza
    		ahora = new Date();
    		fecha_hora_in = '' + $scope.year_mes.year + '-' + ($scope.year_mes.month+1) + '-' + $scope.diaSeleccionado + ' ' + ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();

    		DB_Nube.insertAusencia({asignatura_id: null, alumno_id: alumno.alumno_id, periodo_id: $scope.USER.periodo_id, cantidad_ausencia: null, cantidad_tardanza: null, entrada: 1, tipo: 'tardanza', fecha_hora: fecha_hora_in, uploaded: 'to_create', created_by: $scope.USER.id })
				.then(function(r) {
					$scope.ausenciasDeAlumno(alumno);
				}, function (r2) {
					console.log(r2);
				})

    	}

    	$scope.hide();
    }



    $scope.crearTardanza = function(alumno){
    	$scope.show();

    	//tardanza_id_temp = alumno.tardanza_entrada_id;

      // Si no tenía tardanza_id_temp, es porque no existía, así que creamos la tardanza
      ahora = new Date();
      fecha_hora_in = '' + $scope.year_mes.year + '-' + ($scope.year_mes.month+1) + '-' + $scope.diaSeleccionado + ' ' + ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();

      DB_Nube.insertAusencia({asignatura_id: null, alumno_id: alumno.alumno_id, periodo_id: $scope.USER.periodo_id, cantidad_ausencia: null, cantidad_tardanza: null, entrada: 1, tipo: 'tardanza', fecha_hora: fecha_hora_in, uploaded: 'to_create', created_by: $scope.USER.id })
      .then(function(r) {
        $scope.ausenciasDeAlumno(alumno);
      }, function (r2) {
        console.log(r2);
      })

    	$scope.hide();
    }





	DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	getDaysInMonth = function(year, month) {
		if ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) {
			return 29;
		} else {
			return DAYS_IN_MONTH[month];
		}
	};
	$scope.getAllDaysInMonth = function(month) {
		var d, i, n, num, r;
		num = getDaysInMonth($scope.year_mes.year, month);
		r = [];
		for (i = 1; i <= num; i++) {
		  d = new Date($scope.year_mes.year, parseInt(month), i);
		  n = d.getDay();

			// Poner en true si quiero probar con fines de semana:
			all = false; // false solo traer los días de la semana sin fines
			if (!all) {
			  if (n !== 0 && n !== 6) {
			    r.push(i);
			  }
			}else{
				r.push(i);
			}
		}
		return r;
	};

	$scope.dias = $scope.getAllDaysInMonth($scope.year_mes.month); // Para mostrar los días al iniciar

	$timeout(function() {
	    $ionicScrollDelegate.$getByHandle('buttonsDays').scrollTo($scope.dias.indexOf($scope.diaSeleccionado)*45, 0);
	});


	$scope.show = function() {
		$ionicLoading.show({
			template: 'Cargando...',
		}).then(function(){
			 console.log("Mostrando loading");
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide().then(function(){
			 //console.log("Loading ocultado");
		});
	};


})


