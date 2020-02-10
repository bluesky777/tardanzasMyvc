angular.module('starter.services')

.factory('ConexionServ', function($q, $http, $timeout) {

  //var servidor = 'www.lalvirtual.com';
  var servidor = 'localhost';
  var db, tx;


  db = window.openDatabase("MyVc.db", '1', 'My Virtual College', 1024 * 1024 * 49);
  db.transaction(function (tX) {
    tx = tX;
  });


  if (localStorage.servidor){
    servidor = localStorage.servidor
  }else{
    localStorage.servidor = servidor
  }

  sqlAlumnos = "CREATE TABLE IF NOT EXISTS alumnos (id integer," +
                      "nombres varchar(100)  NOT NULL collate nocase," +
                      "apellidos varchar(100)  DEFAULT NULL collate nocase," +
                      "sexo varchar(1)  NOT NULL," +
                      "fecha_nac date DEFAULT NULL," +
                      "pazysalvo integer DEFAULT '1'," +
                      "deuda integer DEFAULT '0')";
       sqlMatriculas = "CREATE TABLE IF NOT EXISTS matriculas (id integer," +
                     " alumno_id integer DEFAULT NULL," +
                     " grupo_id integer DEFAULT NULL," +
                      "estado varchar(100) default NULL," +
                     " nombre_grupo varchar(100) default NULL)";
      sqlPeriodos = "CREATE TABLE IF NOT EXISTS periodos (id integer DEFAULT NULL," +
                      "fecha_inicio DATETIME NULL," +
                      "fecha_fin DATETIME NULL," +
                      "numero integer NOT NULL," +
                      "actual integer NOT NULL," +
                      "year_id date DEFAULT NULL)";
      sqlGrupos = "CREATE TABLE IF NOT EXISTS grupos (id integer," +
                      "nombre varchar(100) NOT NULL collate nocase," +
                      "abrev varchar(100) DEFAULT NULL," +
                      "year_id integer DEFAULT NULL," +
                      "titular_id integer DEFAULT NULL)";
      sqlProfesores = "CREATE TABLE IF NOT EXISTS profesores (id integer," +
                      "nombres varchar(100) NOT NULL collate nocase," +
                      "apellidos varchar(100) DEFAULT NULL collate nocase," +
                      "sexo varchar(1) DEFAULT NULL," +
                      "fecha_nac date DEFAULT NULL)";
      sqlAusencias = "CREATE TABLE IF NOT EXISTS ausencias (id integer DEFAULT NULL," +
                      "asignatura_id integer DEFAULT NULL," +
                      "alumno_id integer DEFAULT NULL," +
                      "periodo_id integer DEFAULT NULL," +
                      "cantidad_ausencia integer NULL," +
                      "cantidad_tardanza integer NULL," +
                      "entrada integer DEFAULT 0," +
                      "tipo varchar(100) DEFAULT NULL collate nocase," + // ausencia o tardanza
                      "fecha_hora datetime DEFAULT CURRENT_TIMESTAMP," +
                      "uploaded varchar(20) DEFAULT NULL collate nocase," +
                      "created_by integer DEFAULT NULL)";
      sqlYears = "CREATE TABLE IF NOT EXISTS years (id integer," +
                      "year integer NOT NULL," +
                      "nombre_colegio varchar(100) DEFAULT NULL," +
                      "abrev_colegio varchar(100) DEFAULT NULL," +
                      "actual integer DEFAULT NULL)";
      sqlUsers = "CREATE TABLE IF NOT EXISTS users (id integer," +
                      "username varchar(100) NOT NULL collate nocase," +
                      "password varchar(100) DEFAULT NULL," +
                      "sexo varchar(1) DEFAULT NULL collate nocase," +
                      "nombres varchar(100) DEFAULT NULL collate nocase," +
                      "apellidos varchar(100) DEFAULT NULL collate nocase," +
                      "is_superuser integer DEFAULT '0'," +
                      "tipo varchar(100) DEFAULT NULL collate nocase," +
                      "persona_id integer DEFAULT NULL,"+
                      "numero_periodo integer DEFAULT NULL,"+
                      "periodo_id integer DEFAULT NULL," +
                      "year_id integer DEFAULT NULL," +
                      "year integer DEFAULT NULL)";





  result = {
    get: function() {
      return servidor;
    },
    getDb: function() {
      return db;
    },
    set: function(servidorNuevo) {
      servidor = servidorNuevo;
      localStorage.servidor = servidorNuevo;
      console.log(servidor);
      return servidor;
    },
    geturl: function(servidorNuevo) {
      //prot = window.location.protocol; file: http: etc
      if (servidor == 'localhost') {
        prot = 'http://';
      }else{
        prot = 'https://';
      }
      return prot + servidor + '/5myvc/public/tardanzas/';
    },
    open: function(){
      db.transaction(function (tX) {
        return tx = tX;
      })
    },
    getYears: function(){
      sql="SELECT * FROM years";
      return this.query(sql);
    },
    query: function(sql, datos, datos_callback){ // datos_callback para los alumnos en for, porque el i cambia
      var defered = $q.defer();

      if(typeof datos === "undefined") {
        datos = [];
      }

      db.transaction(function (tx) {
        tx.executeSql(sql, datos, function (tx, result) {
          var items = [];
          for (i = 0, l = result.rows.length; i < l; i++) {
            items.push(result.rows.item(i));
          }
          if (datos_callback) {
            defered.resolve({items: items, callback: datos_callback});
          }else{
            defered.resolve(items);
          }



        }, function(tx,error){
          console.log(error.message, sql, datos);
          defered.reject(error.message, datos_callback)
        }) // db.executeSql
      }); // db.transaction
      return defered.promise;
    },
    createTables: function(){
      var defered = $q.defer();

      db.transaction(function (tx) {
        tx.executeSql(sqlAlumnos, [], function (tx, result) {
          //console.log('Tabla alumnos creada');
        }, function(tx,error){
          console.log("Tabla alumnos NO se pudo crear", error.message);
        })
        tx.executeSql(sqlMatriculas, [], function (tx, result) {
          //console.log('Tabla matriculas creada');
        }, function(tx,error){
          console.log("Tabla matriculas NO se pudo crear", error.message);
        })
        tx.executeSql(sqlPeriodos, [], function (tx, result) {
          //console.log('Tabla periodos creada');
        }, function(tx,error){
          console.log("Tabla periodos NO se pudo crear", error.message);
        })
        tx.executeSql(sqlGrupos, [], function (tx, result) {
          //console.log('Tabla grupos creada');
        }, function(tx,error){
          console.log("Tabla grupos NO se pudo crear", error.message);
        })
        tx.executeSql(sqlProfesores, [], function (tx, result) {
          //console.log('Tabla profesores creada');
        }, function(tx,error){
          console.log("Tabla profesores NO se pudo crear", error.message);
        })
        tx.executeSql(sqlAusencias, [], function (tx, result) {
          //console.log('Tabla ausencias creada');
        }, function(tx,error){
          console.log("Tabla ausencias NO se pudo crear", error.message);
        })
        tx.executeSql(sqlYears, [], function (tx, result) {
          //console.log('Tabla years creada');
        }, function(tx,error){
          console.log("Tabla years NO se pudo crear", error.message);
        })
        tx.executeSql(sqlUsers, [], function (tx, result) {
          console.log('Hasta tabla users creada');
          defered.resolve('Hasta tabla users creada');
        }, function(tx,error){
          console.log("Tabla users NO se pudo crear", error.message);
        })
      });

      return defered.promise;
    },

    createTableAusencias: function(){
      var defered = $q.defer();

      db.transaction(function (tx) {

        tx.executeSql(sqlAusencias, [], function (tx, result) {
          console.log('Tabla ausencias creada');
          defered.resolve('Tabla ausencias creada');
        }, function(tx,error){
          defered.reject('Ausencias NO creada');
          console.log("Tabla ausencias NO se pudo crear", error.message);
        })

      });

      return defered.promise;
    },

    deleteTables: function() {
      var defered = $q.defer();

      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE alumnos",[],
          function(tx,results){console.log("Tabla alumnos eliminada")},
          function(tx,error){console.log("alumnos, Could not delete", error.message)}
        );
      });
      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE matriculas",[],
          function(tx,results){console.log("Tabla matriculas eliminada")},
          function(tx,error){console.log("matriculas, Could not delete", error.message)}
        );
      });
      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE periodos",[],
          function(tx,results){console.log("Tabla periodos eliminada")},
          function(tx,error){console.log("periodos, Could not delete", error.message)}
        );
      });
      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE grupos",[],
          function(tx,results){console.log("Tabla grupos eliminada")},
          function(tx,error){console.log("grupos, Could not delete", error.message)}
        );
      });
      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE profesores",[],
          function(tx,results){console.log("Tabla profesores eliminada")},
          function(tx,error){console.log("profesores, Could not delete", error.message)}
        );
      });
      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE ausencias",[],
          function(tx,results){console.log("Tabla ausencias eliminada")},
          function(tx,error){console.log("ausencias, Could not delete", error.message)}
        );
      });
      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE years",[],
          function(tx,results){console.log("Tabla years eliminada")},
          function(tx,error){console.log("years, Could not delete", error.message)}
        );
      });
      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE users",[],
          function(tx,results){
            console.log("Tabla users eliminada");
            defered.resolve('Hasta la de usuarios eliminada');
        },
          function(tx,error){
            defered.reject(error.message);
            console.log("users, Could not delete", error.message)}
        );
      });

      return defered.promise;

    },

    deleteTableAusencias: function() {
      var defered = $q.defer();

      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE ausencias",[],
          function(tx,results){
            console.log("Tabla ausencias eliminada");
            defered.resolve('Tabla ausencias eliminada');},
          function(tx,error){
            defered.reject(error.message);
            console.log("ausencias, Could not delete", error.message)}
        );
      });

      return defered.promise;

    },

    insertAlumno: function(datos){
      db.transaction(function (tx) {

        var query = "INSERT INTO alumnos (id, nombres, apellidos, sexo, fecha_nac, pazysalvo, deuda) VALUES (?,?,?,?,?,?,?)";
        tx.executeSql(query, [datos.id, datos.nombres, datos.apellidos, datos.sexo, datos.fecha_nac, datos.pazysalvo, datos.deuda], function(tx, res) {
          //console.log(res.insertId);
        }, function (tx, err) {
          console.error(err.message);
        });
      })
    },

    insertMatricula: function(datos){
      db.transaction(function (tx) {

        var query = "INSERT INTO matriculas (id, alumno_id, grupo_id, estado, nombre_grupo) VALUES (?,?,?,?,?)";
        tx.executeSql(query, [datos.id, datos.alumno_id, datos.grupo_id, datos.estado, datos.nombre_grupo], function(tx, res) {
          //console.log(res.insertId);
        }, function (tx, err) {
          console.error(err.message);
        });
      })
    },

    insertPeriodo: function(periodo){
      db.transaction(function (tx) {

        var query = "INSERT INTO periodos (id, fecha_inicio, fecha_fin, numero, actual, year_id) VALUES (?,?,?,?,?,?)";
        tx.executeSql(query, [periodo.id, periodo.fecha_inicio, periodo.fecha_fin, periodo.numero, periodo.actual, periodo.year_id], function(tx, res) {
          //console.log(res.insertId);
        }, function (tx, err) {
          console.error(err.message);
        });
      })
    },

    insertGrupo: function(grupo){
      db.transaction(function (tx) {

        var query = "INSERT INTO grupos (id, nombre, abrev, year_id, titular_id) VALUES (?,?,?,?,?)";
        tx.executeSql(query, [grupo.id, grupo.nombre, grupo.abrev, grupo.year_id, grupo.titular_id], function(tx, res) {
          //console.log(res.insertId);
        }, function (tx, err) {
          console.error(err.message);
        });
      })
    },

    insertProfesor: function(datos){
      db.transaction(function (tx) {

        var query = "INSERT INTO profesores (id, nombres, apellidos, sexo, fecha_nac) VALUES (?,?,?,?,?)";
        tx.executeSql(query, [datos.id, datos.nombres, datos.apellidos, datos.sexo, datos.fecha_nac], function(tx, res) {
          //console.log(res.insertId);
        }, function (tx, err) {
          console.error(err.message);
        });
      })
    },
    insertAusencia: function(datos, sin_promesa){
      var defered = $q.defer();
      db.transaction(function (tx) {
        datos_arr = [datos.asignatura_id, datos.alumno_id, datos.periodo_id, datos.cantidad_ausencia, datos.cantidad_tardanza, datos.entrada, datos.tipo, datos.fecha_hora, datos.uploaded, datos.created_by];
        var query = "INSERT INTO ausencias (asignatura_id, alumno_id, periodo_id, cantidad_ausencia, cantidad_tardanza, entrada, tipo, fecha_hora, uploaded, created_by) VALUES (?,?,?,?,?,?,?,?,?)";

        if ( datos.id ) {
          datos_arr.unshift(datos.id);
          query = "INSERT INTO ausencias (id, asignatura_id, alumno_id, periodo_id, cantidad_ausencia, cantidad_tardanza, entrada, tipo, fecha_hora, uploaded, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        }else{
          query = "INSERT INTO ausencias (asignatura_id, alumno_id, periodo_id, cantidad_ausencia, cantidad_tardanza, entrada, tipo, fecha_hora, uploaded, created_by) VALUES (?,?,?,?,?,?,?,?,?,?)";
        }

        tx.executeSql(query, datos_arr, function(tx, res) {
          defered.resolve(res);
        }, function (tx, err) {
          console.error(err.message);
          defered.reject(err.message);
        });
      })
      if (!sin_promesa) {
        return defered.promise;
      }

    },

    insertYear: function(datos){
      db.transaction(function (tx) {

        var query = "INSERT INTO years (id, year, nombre_colegio, abrev_colegio, actual) VALUES (?,?,?,?,?)";
        tx.executeSql(query, [datos.id, datos.year, datos.nombre_colegio, datos.abrev_colegio, datos.actual], function(tx, res) {
          //console.log(res.insertId);
        }, function (tx, err) {
          console.error(err.message);
        });
      })
    },

    insertUser: function(user, con_promesa){
      var deferedU = $q.defer();
      user.password = localStorage.password;
      db.transaction(function (tx) {

        var query = "INSERT INTO users (id, username, password, sexo, nombres, apellidos, is_superuser, tipo, persona_id, periodo_id, numero_periodo, year_id, year) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        tx.executeSql(query, [user.user_id, user.username, user.password, user.sexo, user.nombres, user.apellidos, user.is_superuser, user.tipo, user.persona_id, user.periodo_id, user.numero_periodo, user.year_id, user.year], function(tx, res) {
          deferedU.resolve(res);
          //console.log(res.insertId);
        }, function (tx, err) {
          console.error(err.message);
          deferedU.reject(err.message);
        });
      })
      if (con_promesa) {
        return deferedU.promise;
      }
    },

    login: function(loginData){
      var defered = $q.defer();

      $http.post(this.geturl() + 'login', loginData).then(function(r){
        r = r.data
        console.log('Se logueó', r);
        defered.resolve(r);

      }, function(r2){
        console.log('Falla al loguear', r2);
        defered.reject(r2);
      });
      return defered.promise;

    },

    trayendoDatos: function(loginData){
      var defe = $q.defer();

      $http.post(this.geturl() + 'login/traer-datos', loginData).then(function(r){

        r           = r.data
        alumnos     = r.alumnos
        matriculas  = r.matriculas
        periodos    = r.periodos
        grupos      = r.grupos
        profesores  = r.profesores
        ausencias   = r.ausencias
        years       = r.years

        // Alumnos
        for (var i = 0; i < alumnos.length; i++) {
          result.insertAlumno(alumnos[i]);
        }
        // Matriculas
        for (var i = 0; i < matriculas.length; i++) {
          result.insertMatricula(matriculas[i]);
        }
        // Periodos
        for (var i = 0; i < periodos.length; i++) {
          result.insertPeriodo(periodos[i]);
        }
        // grupos
        for (var i = 0; i < grupos.length; i++) {
          result.insertGrupo(grupos[i]);
        }
        // profesores
        for (var i = 0; i < profesores.length; i++) {
          result.insertProfesor(profesores[i]);
        }
        // ausencias
        for (var i = 0; i < ausencias.length; i++) {
          result.insertAusencia(ausencias[i], true);
        }
        // years
        for (var i = 0; i < years.length; i++) {
          result.insertYear(years[i]);
        }
        // Usuario
        result.insertUser(r, true).then(function(rU){
          defe.resolve(rU);
        }, function(r2){
          defe.reject(r2);
        });


      }, function(r2){
        defe.reject(r2);
      });

      return defe.promise;

    },

    trayendoDatosAusencias: function(loginData){
      var defeTrAus = $q.defer();

      $http.post(this.geturl() + 'login/traer-datos-ausencias', loginData).then(function(r){

        ausencias   = r.data

        // ausencias
        for (var i = 0; i < ausencias.length; i++) {
          result.insertAusencia(ausencias[i], true);
        }

        $timeout(function(){
          defeTrAus.resolve('Ausencias traídas e insertadas.');
        }, 1000); // timeout

      }, function(r2){
        defeTrAus.reject(r2);
      });

      return defeTrAus.promise;

    }

  }

  return result;

});
