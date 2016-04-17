app.controller("medicinasCtrl", function($scope, Users, Hours, Tomas, Notify, Categorias, Medicamentos, $state, $stateParams, $window, $ionicPopup, $ionicModal, $http, $filter, $ionicHistory) {

    /* MODAL DíaAS*/
    $ionicModal.fromTemplateUrl('templates/days.html',{
        scope:$scope
    }).then(function(modal){
        $scope.modalDays = modal;
    });

    $scope.openDaysForm = function(user){
        $scope.user = user;
        if (angular.isDefined( $scope.user ) && angular.isDefined( $scope.user.days )) {
            var days = $scope.user.days;
            $scope.days =
                { "l": days.indexOf("L") > -1,
                  "m": days.indexOf("M") > -1,
                  "x": days.indexOf("X") > -1,
                  "j": days.indexOf("J") > -1,
                  "v": days.indexOf("V") > -1,
                  "s": days.indexOf("S") > -1,
                  "d": days.indexOf("D") > -1
               };
        }
        $scope.modalDays.show();
    }

    $scope.closeDaysForm = function(){
        $scope.modalDays.hide();
    }

    /* MODAL UNIDADES */
    $ionicModal.fromTemplateUrl('templates/unidades.html',{
        scope:$scope
    }).then(function(modal){
        $scope.modalUnidades = modal;
    })

    $scope.openUnidadesForm = function(user){
        $scope.user = user;
        $scope.modalUnidades.show();
    }

    $scope.closeUnidadesForm = function(){
        $scope.modalUnidades.hide();
    }

    $scope.setUnits = function(units){
        $scope.user.units = units;
        $scope.modalUnidades.hide();
    }

    /* MODAL PERIODICIDAD */
    $ionicModal.fromTemplateUrl('templates/periodicidad.html',{
        scope:$scope
    }).then(function(modal){
        $scope.modalPeriodicidad = modal;
    })

    $scope.openPeriodicidadForm = function(user){
        $scope.user = user;
        $scope.modalPeriodicidad.show();
    }

    $scope.closePeriodicidadForm = function(){
        $scope.modalPeriodicidad.hide();
    }

    $scope.setFrequency = function(frequency){
        $scope.user.frequency = frequency;
        $scope.modalPeriodicidad.hide();
    }

    /* MODAL LISTA HORAS*/
    $ionicModal.fromTemplateUrl('templates/hours.html',{
        scope:$scope
    }).then(function(modal){
        $scope.modalHours = modal;
    });

    $scope.openHoursForm = function(hours){
        console.log('open hours -> ' + hours);
        $scope.modalHours.show();

        if (hours == null) hours = [];

        $scope.user.hours = hours;
        $scope.user.hoursString = hours.join(", ");

        $scope.setHours = function(hours) {
            $scope.user.hours = hours;
            $scope.user.hoursString = hours.join(", ");
            $scope.modalHours.hide();
        }

        $scope.removeHour = function(hour) {
            var index = $scope.user.hours.indexOf(hour);
            $scope.user.hours.splice(index, 1);
        }
    }

    $scope.closeHoursForm = function() {
        $scope.user.hours = hours;
        $scope.user.hoursString = hours.join(', ');
        $scope.modalHours.hide();
    }

    /*****/

    /*** MODAL NUEVA HORA ***/

    $ionicModal.fromTemplateUrl('templates/newHour.html', {
        scope:$scope
    }).then(function(modal) {
        $scope.modalNewHour = modal;
    });

    $scope.openNewHourForm = function(med) {
        $scope.hours = med.hours;
        $scope.modalNewHour.show();
        $scope.novalid = false;
    }

    $scope.closeNewHourForm = function() {
        $scope.modalNewHour.hide();
        $scope.valid = false;
    }

    /*****/

    $scope.initNewHour = function() {
        if (!angular.isDefined($scope.data)) {
            var date = new Date();
            date.setHours(00,00,00,00);
            var data =  {
                newhour: date
            }

            $scope.data = data;
        }
    }

    $scope.saveHour = function(form, hours, data) {
        if (form.$valid) {
            if (!angular.isDefined(data) || !angular.isDefined(data.newhour)){
                alert("No se ha especificado la hora");
            } else {
                //Comprobar si ya existe la hora
                var hourSt = $filter('date')(data.newhour,"HH:mm");
                if (hours.indexOf(hourSt) > -1){
                    $scope.aviso("Nueva hora", "Ya existe la hora de toma "+hourSt+" para este medicamento");
                } else {
                    hours.push(hourSt);
                    $scope.modalNewHour.hide();
                }
            }
            $scope.novalid = false;
        } else {
            $scope.novalid = true;
        }
    }

    $scope.openLink = function() {
        window.open("http://www.google.com/", "_system", "location=yes");
    }

    $scope.initUsers = function() {
        Users.all().then(function(users){
            $scope.users = users;
            console.log(users);
        });
    }

    $scope.initCategorias = function() {
        Categorias.all().success(function(data) {
            $scope.categorias = data;
            console.log(data);
        });
    }

    $scope.initMedicamentos = function() {
        $scope.catId = $stateParams.catId;
        Medicamentos.all().success(function(data) {
            var filtered_meds = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].Categoria == $scope.catId)
                    filtered_meds.push(data[i]);
            }
            $scope.medicamentos = filtered_meds;
            console.log(data);
        });
    }

    $scope.initAddUsers = function() {
        $scope.medId = $stateParams.medId;
        Medicamentos.get($scope.medId, function(med) {
            $scope.medicamento = med;
            console.log(med);

            var hourIni =  new Date();
            hourIni.setHours(08,00,00,00)

            if(!angular.isDefined($scope.user)) {
                var user = {
                    name : med.Nombre,
                    days : "",
                    date_ini : new Date(),
                    //hour_ini : hourIni,
                    //date_end : new Date(),
                    //daycodes : "",
                    hours : [], //["09:08","10:08","11:08"]
                    alarm : 0,
                    suspend : 0,
                    frequency : 1
                }
                $scope.user = user;
            }
        });
    }

    $scope.frequency = [{
        id: 1,
        label: '1 al día',
        value: 24
    },
    {
        id: 2,
        label: 'Cada 2 días',
        value: 48
    },
    {
        id: 3,
        label: 'Una vez por semana',
        value: 168
    },
    {
        id: 4,
        label: 'Cada 15 días',
        value: 360
    },
    {
        id: 5,
        label: 'Una vez por mes',
        value: 720
    },
    {
        id: 6,
        label: 'Cada 2 horas',
        value: 2
    },
    {
        id: 7,
        label: 'Cada 4 horas',
        value: 4
    },
    {
        id: 8,
        label: 'Cada 8 horas',
        value: 8
    }];

    $scope.units = [{
        id: 1,
        label: '1',
    },
    {
        id: 2,
        label: '2',
    },
    {
        id: 3,
        label: '1/2',
    },
    {
        id: 4,
        label: '1/3',
    },
    {
        id: 5,
        label: '1/4',
    }];

    $scope.remove = function(userId) {
        $ionicPopup.confirm({
            title: "Eliminar",
            template: "¿Esta seguro que quiere eliminar este medicamento?",
            scope: $scope,
            buttons: [{
                text: "Aceptar",
                type: "button-positive",
                onTap: function(e) {
                    Users.remove(userId).then(
                        function(res) {
                            $window.location.reload();
                        },
                        function(error) {
                          console.log(error);
                        }
                    )
                }
            },
            {
                text: "Cancelar"
            }]
        })
    }

    // Guardado con formulario
    $scope.saveMed = function(form, user) {
        $scope.edit = false;
        if (form.$valid) {
            var dateIni = new Date(user.date_ini);
            var dateEnd = new Date(user.date_end);

            if (!angular.isDefined(user) || user.name =="") {
                $scope.aviso("Nuevo medicamento", "No se ha especificado el nombre");
            } else if (dateIni.getTime() > dateEnd.getTime()) {
                $scope.aviso("Nuevo medicamento","La fecha de inicio no puede ser posterior a la fecha de fin");
            } else {
                if(!angular.isDefined(user.days)) user.days="";
                if(!angular.isDefined(user.hours)) user.hours=[];

                var freqHours = user.frequency.value;
                user.frequency = user.frequency.id;
                user.units = user.units.id;

                var day = new Date(dateIni.getTime());
                day.setHours(user.hour_ini.getHours());
                var dayEnd = dateEnd;

                var now = new Date();

                var dateIniString = $filter('date')(dateIni,"yyyy-MM-dd")+" 00:00:00";
                var dateEndString  = $filter('date')(dateEnd.getTime(),"yyyy-MM-dd")+" 23:59:59";
                var hourIniString  = $filter('date')(user.hour_ini,"yyyy-MM-dd HH:mm")+":00";

                console.log(JSON.stringify(user));

                Users.add(user, dateIniString, dateIniString, hourIniString).then(
                    function(res) {
                        var medId = res.insertId;
                        /*****/
                        //si hay alarma
                        if (user.alarm) {
                            console.log("Prepare notifications");
                            //$scope.prepareNotifications();  /*******/
                        }

                        while (day.getTime() <= dayEnd.getTime()) {
                            var nameDay =  $filter('date')(day,"EEE");

                            var dateTomaString = $filter('date')(day,"yyyy-MM-ddTHH:mm") + ":00";
                            dateToma = new Date(dateTomaString);

                            var dateTomaStringSave = $filter('date')(day,"yyyy-MM-dd HH:mm") + ":00";

                            Tomas.add(medId, user.name, dateTomaStringSave, 0).then(
                                function(res){
                                    console.log("guardo toma ok ->"+medId+" "+user.name+" "+dateTomaStringSave);

                                    if (user.alarm && dateToma.getTime() > now.getTime()) {
                                        console.log("Create notification");
                                        //$scope.createNotification(res.insertId); ////////////
                                    }

                                },
                                function(error) {
                                    console.log(error);
                                }
                            );

                            day.setHours(day.getHours() + freqHours);
                        }
                        /*****/
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go("home.medicinas");
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
            console.log("med form valid");
        } else {
            console.log("med form no valid");
        }
    }

    $scope.initEditUsers = function() {
        $scope.edit = true;
        var id = $stateParams.userId;
        Users.get(id).then(function(user) {
            console.log("Init edit "+JSON.stringify(user));

            user.date_ini = new Date(user.date_ini);
            user.date_end = new Date(user.date_end);
            user.hour_ini = new Date(user.hour_ini);
            $scope.user = user;

            var units = ($filter('filter')($scope.units, {id: 4 }));
            user.units = units;
            console.log(JSON.stringify(units));
        });
    }

    $scope.update = function(user) {
        var id = $stateParams.userId;
        Users.get(id).then(function(user) {
            console.log("Init edit "+JSON.stringify(user));

            user.date_ini = new Date(user.date_ini);
            user.date_end = new Date(user.date_end);
            user.hour_ini = new Date(user.hour_ini);
            $scope.user = user;

            var units = ($filter('filter')($scope.units, {id: 4 }));
            user.units = units;
            console.log(JSON.stringify(units));
        });
    }

    $scope.initDays = function() {
        $scope.setDays = function(days) {
            var selectedDays = "";
            if(days){
                if(days.l) selectedDays = selectedDays+"L";
                if(days.m) selectedDays = selectedDays+"M";
                if(days.x) selectedDays = selectedDays+"X";
                if(days.j) selectedDays = selectedDays+"J";
                if(days.v) selectedDays = selectedDays+"V";
                if(days.s) selectedDays = selectedDays+"S";
                if(days.d) selectedDays = selectedDays+"D";
            }
            $scope.user.daycodes = selectedDays;
            $scope.user.days = selectedDays.split("") ;
            $scope.closeDaysForm();
        }
    }

    $scope.initHours = function() {
        $scope.addHour = function() {
            var hours = [];
            var dd = hours.concat($scope.user.hours);
            dd.push("15:50");
            $scope.user.hours = dd;
        }
    }

    $scope.initMed = function() {
        var id = $stateParams.userId;
        Users.get(id).then(function(user) {
            user.date_ini = new Date(user.date_ini);
            user.date_end = new Date(user.date_end);
            user.hour_ini = new Date(user.hour_ini);
            user.units = ($filter('filter')($scope.units, {id: user.units}))[0];
            user.frequency = ($filter('filter')($scope.frequency, {id: user.frequency}))[0];
            $scope.user = user;
        });
    }

    $scope.suspendMed = function(user) {
        $ionicPopup.confirm({
            title: "Suspender",
            template: "¿Esta seguro que quiere suspender este medicamento?",
            scope: $scope,
            buttons: [{
                text: "Aceptar",
                type: "button-positive",
                onTap: function(e) {
                    Tomas.getByMedFromNow(user.id).then(
                        function(res) {
                            console.log(JSON.stringify(res));
                            console.log("tomas tenht " + res.length);
                            var now = new Date()
                            for (var i = 0; i < res.length; i++) {
                                console.log(JSON.stringify(res[i]));
                                var date = new Date(res[i].date);
                                if (date.getTime() > now.getTime()) {
                                    $scope.deleteToma(res[i].id);
                                }
                            }
                        },
                        function(error) {
                            console.log(error);
                        }
                    );

                    user.suspend = 1;
                    Users.update(user).then(
                        function(res) {
                            $state.go('users');
                        },
                        function(error){
                            console.log(error);
                        }
                    )
                }
            },
            {
                text: "Cancelar"
            }]
        })
    }

    $scope.deleteMed = function(user) {
        $ionicPopup.confirm({
            title: "Eliminar",
            template: "¿Esta seguro que quiere eliminar este medicamento? Se eliminarán todas las tomas registradas",
            scope: $scope,
            buttons: [{
                text: "Aceptar",
                type: "button-positive",
                onTap: function(e) {
                    Tomas.removeByMed(user.id).then(
                        function(res){},
                        function(error){
                            console.log(error);
                        }
                    );
                    Users.remove(user.id).then(
                        function(res){
                            $state.go('home.medicinas');
                        },
                        function(error){
                            console.log(error);
                        }
                    )
                }
            },
            {
                text: "Cancelar"
            }]
        })
    }

    $scope.editMed = function(id) {
        $state.go('home.editMedicina',{userId: id});
    }

    /**** Test Local Notifications *****/

    $scope.getNotifications = function() {
        cordova.plugins.notification.local.getScheduled(function (notifications) {
            alert(JSON.stringify(notifications));
        });
    }

    $scope.cancelNotifications = function() {
        var tomas = new Array();
        for (var i = 1; i < 50; i++) {
            tomas.push(i);
        }
        cordova.plugins.notification.local.cancel(tomas, function () {
              // Notifications were cancelled
        }, $scope);
    }

    $scope.aviso = function(title, mensaje) {

        $ionicPopup.confirm({
            title: title,
            template: mensaje,
            scope: $scope,
            buttons: [{
                text: "Aceptar",
                type: "button-positive"
            }]
        })
    }

    $scope.prepareNotifications = function() {
        cordova.plugins.notification.local.registerPermission(function (granted) {});
        cordova.plugins.notification.local.on("click", function (notification) {
            var data = JSON.parse(notification.data);
            var id = data['tomaId'];
            $state.go('toma',{tomaId: id});
        });
    }

    $scope.createNotification = function(tomaId) {
        Tomas.get(tomaId).then(function(toma) {
            var date = new Date(toma.date);
            var hour = $filter('date')(date,"HH:mm");

            if (cordova.plugins.notification.local) {
                cordova.plugins.notification.local.schedule({
                    id: tomaId,
                    title: "Aviso de toma",
                    text: toma.med_name+" "+hour,
                    at: date,
                    data: {tomaId: tomaId},
                    //autoClear:  true
                });
            }
        })
    }
})

/* Filtros */
.filter('toDia', function($filter) {
    return function(input) {
        var date = new Date(input.replace(' ','T'));
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        var result = $filter('date')(date,"EEE");
        var res = "";
        if(result=="Mon") result = 'Lunes';
        if(result=="Tue") result = 'Martes';
        if(result=="Wed") result = 'Miércoles';
        if(result=="Thu") result = 'Jueves';
        if(result=="Fri") result = 'Viernes';
        if(result=="Sat") result = 'Sabado';
        if(result=="Sun") result = 'Domingo';
        return result;
    };
})

.filter('arrayNameDays', function($filter){
    return function(letersDays) {
        var nameDays = [];
        if(letersDays.indexOf("L") > -1)
            nameDays.push("Mon");
        if(letersDays.indexOf("M") > -1)
            nameDays.push("Tue");
        if(letersDays.indexOf("X") > -1)
            nameDays.push("Wed");
        if(letersDays.indexOf("J") > -1)
            nameDays.push("Thu");
        if(letersDays.indexOf("V") > -1)
            nameDays.push("Fri");
        if(letersDays.indexOf("S") > -1)
            nameDays.push("Sat");
        if(letersDays.indexOf("D") > -1)
            nameDays.push("Sun");
        return nameDays;
    }
})

.filter('toDiaNum', function($filter) {
    return function(input) {
        var date = new Date(input.replace(' ','T'));
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        var dia = $filter('date')(date,"EEE");
        var num = $filter('date')(date,"dd");
        var res = "";
        if(dia=="Mon") res = 'Lunes';
        if(dia=="Tue") res = 'Martes';
        if(dia=="Wed") res = 'Miércoles';
        if(dia=="Thu") res = 'Jueves';
        if(dia=="Fri") res = 'Viernes';
        if(dia=="Sat") res = 'Sabado';
        if(dia=="Sun") res = 'Domingo';
        return res+" "+num;
    };
})

.filter('toHour', function($filter) {
    return function(input) {
        var date = new Date(input.replace(' ','T'));
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return $filter('date')(date,"HH:mm");
    };
})

.filter('mesAno', function($filter) {
    return function(input) {
        var date = new Date(input);
        var mes = $filter('date')(date,"MM");
        var ano = $filter('date')(date,"yyyy");
        var res = "";
        if(mes==01) res = 'Enero';
        if(mes==02) res = 'Febrero';
        if(mes==03) res = 'Marzo';
        if(mes==04) res = 'Abril';
        if(mes==05) res = 'Mayo';
        if(mes==06) res = 'Junio';
        if(mes==07) res = 'Julio';
        if(mes==08) res = 'Agosto';
        if(mes==09) res = 'Septiembre';
        if(mes==10) res = 'Octubre';
        if(mes==11) res = 'Noviembre';
        if(mes==12) res = 'Diciembre';
        return res+" "+ano;
    };
});
