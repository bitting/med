var app = angular.module('med.controllers', ['med.services', 'ngResource', 'ngMessages'])
.controller('homeCtrl', function($scope, $ionicHistory, $state, Config) {
    $scope.goSeguimiento = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go("home.tomaok");
    }
    
    $scope.goTomas = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        
        $state.go("home.tomas");
    }
    
    $scope.initAvatar = function() {
        $scope.p1 = $scope.avatar == 'p1';
        $scope.p2 = $scope.avatar == 'p2';
        $scope.p3 = $scope.avatar == 'p3';
        $scope.p4 = $scope.avatar == 'p4';
        $scope.p5 = $scope.avatar == 'p5';
        $scope.p6 = $scope.avatar == 'p6';
    }
    
    $scope.changeAvatar = function(avatar) {
        Config.updateAvatar(avatar);
        $scope.avatar = avatar;
        
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
        });
        $state.go('home.inicio');
    }
    
    $scope.menu = function() {
        Config.avatar().then(function(avatar) {
            $scope.avatar = avatar;
        });
    }
});
