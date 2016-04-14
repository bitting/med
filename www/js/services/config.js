serv.factory('Config', function($http, $rootScope, $stateParams, DBA) {
    var self = this;
    
    self.avatar = function() {
        return DBA.query('select * from config').then(function(result) {
            if (result.rows.length == 0) {
                DBA.query('insert into config (avatar) values ("p1")');
                return 'p1';
            } else {
                return result.rows.item(0).avatar;
            }
        });
    }
    
    self.updateAvatar = function(avatar) {
        return DBA.query('update config set avatar = (?)', [avatar]);
    }
    
    return self;
});
