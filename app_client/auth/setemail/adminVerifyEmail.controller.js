(function() {
  
  angular
    .module('meanApp')
    .controller('adminVerifyEmailCtrl', ['$location','$scope','authentication','$routeParams','meanData',adminVerifyEmailCtrl]);

    function adminVerifyEmailCtrl ($location,$scope,authentication,$routeParams, meanData) {


	var vm = this;

      authentication
        .adminVerifyEmail($routeParams.emailHash)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile/admin/register');
        });


      	console.log('Admin Verify Email controller is running');

    }

})();

