var module = angular.module("adminControllers", []);

module.controller('adminController', function(){

	var vm = this;

	// basic variable to display
	vm.message ="SENG 299 Angular Tutorial"

	// a list of students that will be displayed on the home page
	vm.students = [
		{first: "David", last: "Johnson"},
		{first: "Ernest", last: "Aaron"}
	];
});