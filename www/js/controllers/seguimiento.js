app.controller('seguimientoCtrl', function($scope) {
    $scope.initSeguimiento = function() {
        Tomas.all().then(function (tomas) {
            $scope.tomas = tomas;
        });
    }
})
.filter('groupByDayMonth', function($parse, $filter) {
    return function(tomas) {
        if (!tomas) return;

        var output = [],
            previousDate,
            currentDate;

        if (tomas.length > 1) {
            for (var i = 1; i < tomas.length; i++) {
                item = tomas[i];
                itemAnt = tomas[i-1];

                currentDate = new Date(item.date.replace(' ', 'T'));
                currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
            }
        }
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

                currentDate = new Date (item.date.replace(' ', 'T'));
                currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
                previousDate = new Date (itemAnt.date.replace(' ', 'T'));
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
