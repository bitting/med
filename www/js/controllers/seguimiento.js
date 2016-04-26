app.controller('seguimientoCtrl', function($scope, Tomas, $filter, $stateParams) {
    $scope.initSeguimiento = function() {
        Tomas.allGroupDay().then(function (tomasDays) {
            $scope.tomasDays = tomasDays;
        });
    }

    $scope.initSeguimientoDia = function() {
        var day = $stateParams.dia;
        $scope.day = day;
        var todayStringIni = $filter('date')(day, "yyyy-MM-dd") + " 00:00:00";
        var todayStringEnd = $filter('date')(day, "yyyy-MM-dd") + " 23:59:59";

        Tomas.getByDay(todayStringIni, todayStringEnd).then(function(tomas) {
            $scope.tomas = tomas;
            console.log(tomas);
        })
    }
})
.filter('groupByMonthYear', function($parse, $filter) {
    var dividers = {};
    return function(tomas) {
        if (!tomas) return;

        var output = [],
            previousDate,
            currentDate;

        if (tomas.length > 1) {
            for (var i = 1; i < tomas.length; i++) {
                item = tomas[i];
                itemAnt = tomas[i-1];

                currentDate = new Date (item.fecha.replace(' ', 'T'));
                currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
                previousDate = new Date (itemAnt.fecha.replace(' ', 'T'));
                previousDate.setMinutes(previousDate.getMinutes() + previousDate.getTimezoneOffset());

                //Si es la primera añade separador de mes
                if (i == 1) item.sep = $filter('mesAno')(currentDate);
                if ( $filter('date')(currentDate,"MM") != $filter('date')(previousDate,"MM") ){
                    item.sep = $filter('mesAno')(currentDate) ;
                }
                output.push(item);
            }
        }
        return output;
    };
});
