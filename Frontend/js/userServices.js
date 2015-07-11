angular.module('userServices', [])

.factory('User', function($http) {

	// create a new object
	var userFactory = {};

	// get a single user
	userFactory.get = function(id) {
		// since this call requires a user ID we'll add the id to
		// the end of the URL
		return $http.get('/app/user/' + id);
	};

	// get all users
	userFactory.all = function() {
		return $http.get('/app/user/');
	};

	
	
	return userFactory;

});