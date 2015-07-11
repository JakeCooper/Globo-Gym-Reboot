var module = angular.module('adminControllers', ['userServices'])


module.service('adminController', function(){
    this.getAllUsers = function () {
        return ({
            {
            

	var vm = this;

vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;
});
});
                  