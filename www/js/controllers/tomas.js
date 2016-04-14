app.controller("tomasCtrl", function($scope, Tomas, $state, $stateParams, $filter, $ionicHistory) {
    $scope.initTomas = function() {
        var today = new Date();
        var todayStringIni = $filter('date')(today,"yyyy-MM-dd")+" 00:00:00";
        var todayStringEnd = $filter('date')(today,"yyyy-MM-dd")+" 23:59:59";
        
        Tomas.getByDay(todayStringIni, todayStringEnd).then(function(tomas) {
            $scope.tomas = tomas;
            console.log(tomas);
        })
    }
    
    $scope.deleteToma = function(tomaId){
        if (window.cordova) {
            if (cordova.plugins.notification.local) {
                cordova.plugins.notification.local.cancel(tomaId, function () {
                }, $scope);
            }
        }
        
        Tomas.remove(tomaId).then(function(toma){
            $state.go("home.tomas");
        })
    }
    
    $scope.initTomaok = function() {
        var mensajes = [
            'Mensaje 1',
            'Mensaje 2',
            'Mensaje 3',
            'Mensaje 4',
            'Mensaje 5',
            'Mensaje 6',
            'Mensaje 7',
            'Mensaje 8',
            'Mensaje 9',
            'Mensaje 10'
        ];
        
        var rng = Math.floor(Math.random() * 10);
        $scope.indice = rng;
        $scope.mensajealeatorio = mensajes[rng];
    }
    
    $scope.goInicio = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('home.inicio');
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
                currentDate = new Date (item.date);
                previousDate = new Date (itemAnt.date);
                
                if(i==1) item.sep = $filter('mesAno')(currentDate) ;
                
                if ( $filter('date')(currentDate,"MM") != $filter('date')(previousDate,"MM") ){
                    item.sep = $filter('mesAno')(currentDate) ;
                }
                output.push(item);
            }
        }
        return output;
    };
});
