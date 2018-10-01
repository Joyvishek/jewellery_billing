(function() {

  angular
    .module('meanApp')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication','Upload','$timeout','$window'];
  function meanData ($http, authentication,Upload,$timeout,$window) {

    var getProfile = function (routeParams) {
	if(routeParams.sso && routeParams.sig){
	      return $http.get('/api/forum/profile?sso='+routeParams.sso+'&sig='+routeParams.sig, {
		headers: {
		  Authorization: 'Bearer '+ authentication.getToken()
		}
	      });
	}else{
      return $http.get('/api/profile?sso='+routeParams.sso+'&sig='+routeParams.sig, {
		headers: {
		  Authorization: 'Bearer '+ authentication.getToken()
		}
		});
	}
    };
    var googleCallback = function (routeParams) {
      return $http.get('/api/auth/google?code='+routeParams.code
      );
    };

    var getCourseVideo = function (params) {
	var config = {
	 //params: params,
	 headers : {'Accept' : 'application/json'}
	};
      return $http.get('/api/courses/videos/1234',config);
    };


    var isUsernameUnique = function (username) {
      return $http.get('/api/username?username='+username, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };
    var saveUsername = function (username) {
	var config = {
	 params: {username : username},
	 headers : {'Accept' : 'application/json'}
	};
      return $http.post('/api/username/save', config, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    var saveUserType = function (usertype,setemail) {
	var config = {
	 params: {user:{ usertype : usertype }, setemail: setemail},
	 headers : {'Accept' : 'application/json'}
	};
      return $http.post('/api/userdetails/save', config, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };


    var isEmailUnique = function (setemail) {
      return $http.get('/api/email?setemail='+setemail, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };
    var saveEmail = function (setemail) {
	var config = {
	 params: {setemail : setemail},
	 headers : {'Accept' : 'application/json'}
	};
      return $http.post('/api/email/save', config, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

// Create New assignment
    var CreateNewAssignment = function (params) {
  var config = {
   params: params,
   headers : {'Accept' : 'applicattion/json',
      Authorization: 'Bearer '+ authentication.getToken()
    }
  };
      return $http.post('/api/teacher/assignment/createnewassignment', config,{
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
  }
});
    };

//Get user profile after login
    var getUserProfile = function (routeParams) {
      return $http.get('/api/profile', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile,
      isUsernameUnique : isUsernameUnique,
      saveUsername : saveUsername,
      googleCallback : googleCallback,
      getCourseVideo : getCourseVideo,
      getUserProfile : getUserProfile,
    };
  }

})();
