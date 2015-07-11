angular.module('userServices', [])

.factory('User', function($http) {

	// create a new object
	var userFactory = {};


	// get all users
	//userFactory.all = function() {
	//	return $http.get('/user');
	//};
    
    userFactory.test = function(){
        return "fuck";
    };
    
	
	return userFactory;
    
   

});