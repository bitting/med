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
});
