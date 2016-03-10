'use strict';

var app = angular.module('peeps',['phonenumberModule']);

app.filter('tel', function () {
	return function (phoneNumber) {
		if (!phoneNumber)	return phoneNumber;
		return formatLocal('US', phoneNumber);
	}
 });


app.controller('peepsCtrl', function($scope, $http)	{
	$scope.newContact={};
	$scope.blurredFName=false;
	$scope.blurredLName=false;


	$scope.checkRequiredFields= function() {
		return ($scope.newContact.fname.length && $scope.newContact.lname.length);
	};

	$scope.generateID = function(contact){
		return (" "+contact.fname+contact.lname).toLowerCase().replace(/[^a-z]/g,"");
	}

	$scope.addContact=function() {

		if(!$scope.contacts)
			$scope.contacts=[];
		if(!$scope.newContact.id)
				$scope.newContact.id=$scope.generateID($scope.newContact);

		var newClontact=angular.copy($scope.newContact);
		for(var e in newClontact) {
			newClontact[e]=newClontact[e].trim();
		}

		console.log(Array.isArray($scope.contacts));
		$scope.contacts.push(newClontact);

		$scope.postDatabase($scope,$http);
		$('#newContactModal').modal('hide');
	}

	$scope.removeContact=function(contact) {
		$scope.contacts.splice($scope.contacts.indexOf(contact),1);
		$scope.postDatabase($scope,$http);
	}

	$scope.updateContact=function() {
		if($scope.newName) {
			var names=$scope.newName.split(',');
				names.forEach(e=>$scope.names.splice($scope.names.indexOf($scope.newName),1));
			$scope.newName='';
		}
	}

	$scope.clearNewContactForm=function() {
		$scope.newContact={};
		document.getElementById("input-phone").childNodes[0].value='';

;	}

	$scope.getDatabase=function() {
		console.log("GET DB");
		$http({
			method:'GET',
			url:'http://localhost:3333/contacts',
		})
		.then(function(res) {
			console.log("res: ",res);
			$scope.contacts=res.data;
			res.data
			}, function(err) {
				console.error(err);
		});
	};

	$scope.postDatabase=function() {
		console.log("POST NEW TO DB");
		$http({
			method:'POST',
			url:'http://localhost:3333/contacts',
			data:JSON.stringify($scope.contacts)
		})
		.then(function(res) {
			console.log("res: ",res);
			$scope.contacts=res.data;
			}, function(err) {
				console.error(err);
		});
	};

	console.log("mainCtrl loaded!");
	$scope.getDatabase($scope,$http);
	$scope.contacts=[];

	$scope.newContact={};
	$scope.telprompt="(555) 555-1234";




});