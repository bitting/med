serv.factory('Medicamentos', function($http, $rootScope, $stateParams) {
    var self = this;
    self.data = $http.get('json/medicamentos.json', { params: {} });
    
    self.all = function() {
        return self.data;
    }
    
    self.get = function(id, handler) {
        self.data.success(function(alldata) {
            var result = null;
            for (var i = 0; i < alldata.length; i++) {
                console.log(alldata[i].ID + ' - ' + id);
                if (alldata[i].ID == id) {
                    handler(alldata[i]);
                    return;
                }
            }
        });
    }
    
    return self;
})
.factory('Categorias', function($http, $rootScope, $stateParams) {
    var self = this;
    self.data = $http.get('json/categorias.json', { params: {} });
    
    self.all = function() {
        return self.data;
    }
    
    return self;
});
