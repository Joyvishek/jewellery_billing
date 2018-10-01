(function () {

  angular
    .module('meanApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location','authentication','meanData','$routeParams','$scope','$window'];
  function navigationCtrl($location, authentication,meanData,$routeParams,$scope,$window) {
    var vm = this;

    vm.sectionStudentIds = [];
    vm.isLoggedIn = authentication.isLoggedIn();
    $scope.classroomsessiondata = {};
    vm.currentUser = authentication.currentUser();
    // Check if classroom session has already started
    $scope.hasClassEntered = false;
    var tempclassroomSectionId = meanData.getClassroomSection();
    
    if(tempclassroomSectionId){
      console.log(tempclassroomSectionId);
      $scope.hasClassEntered = true;
      $scope.classroomsessiondata.classroomSectionId = tempclassroomSectionId;
    }else{
      $scope.hasClassEntered = false;
    }
// enterclass
      $scope.enterClass = function() {
        $window.location = '/teachers/startclass/' + $scope.classroomsessiondata.classroomSectionId;
      }
    meanData.getProfile($routeParams)
      .success(function(data) {
       vm.profilepic=data.profilepic;
    });
    $scope.logout = function(){
      $window.localStorage.removeItem('classroomSessionId');
      $window.localStorage.removeItem('currentsectionId');
      authentication.logout();
      $window.location  = '/login_external';
    };
  }
})();
