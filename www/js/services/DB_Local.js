angular.module('starter.services')

.factory('DB_Local', function($q, ConexionServ) {




  var result = {


    eliminarAusencia: function(ausencia){
        var defered = $q.defer();
        var cons = "DELETE FROM ausencias WHERE rowid=?";

        ConexionServ.query(cons, [ausencia.rowid]).then(function(){
          defered.resolve();
        }, function(r2){
          defered.reject(r2);
        });

        return defered.promise;

    },


    updateAusencia: function(ausencia_id){
        var defered = $q.defer();
        var cons = "UPDATE ausencias SET uploaded='to_delete' WHERE rowid=?";

        ConexionServ.query(cons, [ausencia_id]).then(function(r){
          defered.resolve();
        }, function(r2){
          defered.reject(r2);
        });

        return defered.promise;

    },

    insertAusencia: function(datos){
        var defered = $q.defer();

        datos_arr = [datos.asignatura_id, datos.alumno_id, datos.periodo_id, datos.cantidad_ausencia, datos.cantidad_tardanza, datos.entrada, datos.tipo, datos.fecha_hora, datos.uploaded, datos.created_by];
        var query = "";

        var argumentos = datos.asignatura_id +','+ datos.alumno_id+','+ datos.periodo_id+','+ datos.cantidad_ausencia+','+ datos.cantidad_tardanza+','+ datos.entrada+', "'+ datos.tipo+'","'+ datos.fecha_hora+'","'+ datos.uploaded+'",'+ datos.created_by;

        if ( datos.id ) {
          argumentos = datos.id +','+ argumentos;
          query = "INSERT INTO ausencias (id, asignatura_id, alumno_id, periodo_id, cantidad_ausencia, cantidad_tardanza, entrada, tipo, fecha_hora, uploaded, created_by) VALUES (" + argumentos + ")";

        }else{
          query = "INSERT INTO ausencias (asignatura_id, alumno_id, periodo_id, cantidad_ausencia, cantidad_tardanza, entrada, tipo, fecha_hora, uploaded, created_by) VALUES (" + argumentos + ")";

        }

        ConexionServ.query(query).then(function(){
            defered.resolve();
        }, function(r2){
            defered.reject(r2);
        });


        return defered.promise;



    },

    setUploadedAusenciaTo: function(ausencia, to_estado){
        var defered = $q.defer();
        cons = "UPDATE ausencias SET uploaded=? WHERE rowid=?";

        ConexionServ.query(cons, [to_estado, ausencia.rowid]).then(function(r){
          defered.resolve(r.data);
        }); // ConexionServ.query UPDATE AUS

        return defered.promise;

    }

  }

  return result;

});
