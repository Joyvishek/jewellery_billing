(function () {

  angular.module('meanApp', ['ngRoute','ngFileUpload','ngImgCrop','ngSanitize','ngMaterial']);


  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/website/website.view.html',
        //controller: 'login_externalCtrl',
        //controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/logout', {
        templateUrl: '/auth/logout/logout.view.html',
        controller: 'logoutCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: '/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .when('/login_external', {
        templateUrl: '/auth/login_external/login_external.view.html',
        controller: 'login_externalCtrl',
        controllerAs: 'vm'
      })
      .when('/username', {
	      templateUrl: '/auth/username/username.view.html',
        controller: 'usernameCtrl',
        controllerAs: 'vm'
      })
      .when('/x/:username', {
	      templateUrl: '/profile/public/publicprofile.view.html',
        controller: 'publicprofileCtrl',
        controllerAs: 'vm'
      })
      .when('/setemail', {
	      templateUrl: '/auth/setemail/setemail.view.html',
        controller: 'setEmailCtrl',
        controllerAs: 'vm'
      })
      .when('/emailverify/:emailHash', {
	      templateUrl: '/auth/setemail/verifyemail.view.html',
        controller: 'verifyEmailCtrl',
        controllerAs: 'vm'
      })
      .when('/auth/forum', {
        templateUrl: '/auth/forum/forumprofile.view.html',
        controller: 'forumprofileCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication, $http) {

    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
      else if ($location.path() === '/username' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
      else if ($location.path() === '/auth/forum' && !authentication.isLoggedIn()) {
        $location.path('/login_external');
      }
    });
   $rootScope.$on("$routeChangeSuccess", function (e, current) {
	a=current.params;
	url = Object.keys(a).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(a[k])
	}).join('&')
        $rootScope.query = url;
    });

	$(document).on( 'scroll', function(){

		if ($(window).scrollTop() > 100) {
			$('.scroll-top-wrapper').addClass('show');
		} else {
			$('.scroll-top-wrapper').removeClass('show');
		}
	});

   $rootScope.$on("$viewContentLoaded", function (e, current) {
	$('li.dropdown').find('.fa-angle-down').each(function(){
		$(this).on('click', function(){
			if( $(window).width() < 768 ) {
				$(this).parent().next().slideToggle();
			}
			return false;
		});
	});

	//Fit Vids
	if( $('#video-container').length ) {
		$("#video-container").fitVids();
	}

	//Initiat WOW JS
	new WOW().init();


		$('.main-slider').addClass('animate-in');
		$('.preloader').remove();
		//End Preloader

		if( $('.masonery_area').length ) {
			$('.masonery_area').masonry();//Masonry
		}

		var $portfolio_selectors = $('.portfolio-filter >li>a');

		if($portfolio_selectors.length) {

			var $portfolio = $('.portfolio-items');
			$portfolio.isotope({
				itemSelector : '.portfolio-item',
				layoutMode : 'fitRows'
			});

			$portfolio_selectors.on('click', function(){
				$portfolio_selectors.removeClass('active');
				$(this).addClass('active');
				var selector = $(this).attr('data-filter');
				$portfolio.isotope({ filter: selector });
				return false;
			});
		}

	$('.timer').each(count);
	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}

	// Search
	$('.fa-search').on('click', function() {
		$('.field-toggle').fadeToggle(200);
	});

	// Contact form
	var form = $('#main-contact-form');
	form.submit(function(event){
		event.preventDefault();
		var form_status = $('<div class="form_status"></div>');
		$.ajax({
			url: $(this).attr('action'),
			beforeSend: function(){
				form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn() );
			}
		}).done(function(data){
			form_status.html('<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>').delay(3000).fadeOut();
		});
	});

	// Progress Bar
	$.each($('div.progress-bar'),function(){
		$(this).css('width', $(this).attr('data-transition')+'%');
	});

	if( $('#gmap').length ) {
		var map;

		map = new GMaps({
			el: '#gmap',
			lat: 43.04446,
			lng: -76.130791,
			scrollwheel:false,
			zoom: 16,
			zoomControl : false,
			panControl : false,
			streetViewControl : false,
			mapTypeControl: false,
			overviewMapControl: false,
			clickable: false
		});

		map.addMarker({
			lat: 43.04446,
			lng: -76.130791,
			animation: google.maps.Animation.DROP,
			verticalAlign: 'bottom',
			horizontalAlign: 'center',
			backgroundColor: '#3e8bff',
		});
	}

    });

  }

  angular
    .module('meanApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication','$http', run]);

})();
