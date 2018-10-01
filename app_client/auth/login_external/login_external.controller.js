(function() {
  
  angular
    .module('meanApp')
    .controller('login_externalCtrl', ['$location','$scope','authentication','$routeParams','meanData','$window',login_externalCtrl]);

    function login_externalCtrl ($location,$scope,authentication,$routeParams, meanData, $window) {


	var vm = this;
if($routeParams.sso){
	$window.localStorage['sso'] = $routeParams.sso;
	$window.localStorage['sig'] = $routeParams.sig;
}

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication
        .login(vm.credentials)
        .error(function(err){
          //alert(vm.credentials);
        })
        .then(function(data){
        	meanData.getUserProfile()
	      		.success(function(userdata) {
	        	vm.jsondata = userdata;
	        	if (vm.jsondata.usertype == 'ADMIN') {
	        		$location.path('/admin/admindashboard');
	        	}
	        	else if (vm.jsondata.usertype == 'STOCKIEST') {
	        		$location.path('/stockiest/inventorylist');	
	        	}
	        	else if (vm.jsondata.usertype == 'CASHIER') {
	        		$location.path('/cashier/invoicelist');	
	        	}
	        	else{
	        		$location.path('/students/platform/section/');	
	        	}
	 		});
        });
    };
      	console.log('External controller is running');

    }

})();
