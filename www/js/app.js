(function(){
var smokApp = angular.module('smokizzApp', ['ionic', 'ui.router']);

smokApp.config(function($stateProvider, $urlRouterProvider) {
   $stateProvider
    .state('homepage', {
      url: '/',
      templateUrl: 'index.html',
      controller: 'startController'
    })
    .state('mainpage', {
      url: '/mainpage',
      templateUrl: 'main.html',
      resolve: {
        
      },
      controller: 'smokizzController'
    });


    $urlRouterProvider.otherwise("/");
});

/* First controller */
smokApp.controller('smokizzController', function($scope, $state, $interval, $timeout, $ionicPopup) {
  $scope.life =  window.localStorage.getItem("life") == undefined ? 0 : parseInt(window.localStorage.getItem("life"));
  $scope.minuteGain = window.localStorage.getItem("minuteGain") == undefined ? 0 : parseInt(window.localStorage.getItem("minuteGain"));
  $scope.cigarette = window.localStorage.getItem("cigarette") == undefined ? 0 : parseInt(window.localStorage.getItem("cigarette"));
  $scope.moneySpent = window.localStorage.getItem("moneySpent");
  $scope.addMoney = window.localStorage.getItem("addMoney") == undefined ? 0 : parseInt(window.localStorage.getItem("addMoney"));;
  $scope.clock = Date.now();
  $scope.days = window.localStorage.getItem("days") == undefined ? 0 : parseInt(window.localStorage.getItem("days"));
  $scope.isDisabled = false;
  const fullDay = 0;

/* On tap no smoke button */
$scope.onButtonPress = function(event){

//Disable the buttons first then run timer
//NOTE: The time set is not 7 minutes but 3 seconds for testing purpose
  $scope.showAlert();
  $scope.isDisabled = true;
  enableButtonTimer();
};

/* On tap smoke button */
$scope.onSmokeTap = function(event){
 $scope.smokeUrl = "../www/img/smokizimg/smokeiconshadow.png";
};

/* Display alert */
$scope.showAlert = function() {
    var dialog = $ionicPopup.alert({
     title: 'Please wait',
     template: 'Button will be available after 7 minutes'
   });
};

/* Add timeout to button */
$scope.noClickTime = function(){
  
};

/* Add minute */
$scope.addMinute = function(){
  $scope.minuteGain = $scope.minuteGain + 10;
};

/* Add life */
$scope.addLife = function() {
  if($scope.minuteGain >= 30){//Normally it should be 1440 minutes but I set it 30 minutes for testing purpose
    $scope.life++;
    $scope.minuteGain = 0;
  }
}; 

/* Decrease minute */
$scope.decreaseMinute = function(){
  $scope.minuteGain = $scope.minuteGain - 10;
};

/* Decrease life */
$scope.decreaseLife = function() {
  if($scope.minuteGain < 0){
    $scope.minuteGain = 30; //Normally it should be 1440 minutes but I set it 30 minutes for testing purpose
    $scope.life--;
  }
};

/* Cigarette not smoked */
$scope.increaseCigaretteNotSmoked = function(){
  $scope.cigarette++;
};

/* Save data */
/* Add money saved */
  $scope.addMoneySaved = function(moneySpent){
    $scope.moneySpentPerCigarette = $scope.moneySpent / 20;
    $scope.addMoney = $scope.addMoney + $scope.moneySpentPerCigarette;
  };

  /* Set minute gain */
  $scope.saveMinuteGain = function() {
    window.localStorage.setItem("minuteGain", $scope.minuteGain);
  };

  /* Set life gain */
  $scope.saveLife = function() {
    window.localStorage.setItem("life", $scope.life);
  };

  /* Set cigarette not smoke */
  $scope.saveCigarette = function() {
    window.localStorage.setItem("cigarette", $scope.cigarette);
  };

  /* Set days */
  $scope.saveDays = function() {
    window.localStorage.setItem("days", $scope.days);
  };

  /* Set added money saved */
  $scope.saveAddMoney= function() {
    window.localStorage.setItem("addMoney", $scope.addMoney);
  };
  /* --------------- */

  /* Calls all the function when button is tap */
  $scope.onClickRejectedSmokeBtn = function(){
    $scope.addMinute() 
    $scope.addLife() 
    $scope.increaseCigaretteNotSmoked()
    $scope.addMoneySaved()
    $scope.saveLife()
    $scope.saveMinuteGain()
    $scope.saveCigarette()
    $scope.saveDays()
    $scope.saveAddMoney()
    $scope.onButtonPress()
  };

  $scope.onClickSmokeBtn = function(){
    $scope.decreaseMinute()
    $scope.decreaseLife()
    $scope.saveLife()
    $scope.saveMinuteGain()
    $scope.saveDays()
    $scope.saveAddMoney()
    $scope.onButtonPress()
  };

/* Timer */
  var timer = function() {
    var currentDate = new Date();
    $scope.clock = currentDate.getTime();
    window.localStorage.setItem("savedTime", Date.now());
    if(currentDate.getHours() == fullDay){
      $scope.days++;
    }
      delete currentDate;
  };

/* Disable button */
  var enableButton = function() {
    $scope.isDisabled = false;
  };

  var enableButtonTimer = function(){
    $timeout(enableButton, 7000); //Set to 3 seconds for testing purpose
  };

  $interval(timer, 1000);


$scope.$on('$ionicView.loaded', function() {
  $scope.calculateNoSmokingDays();
});

$scope.$on('cordovaResumeEvent', function(){
  $scope.calculateNoSmokingDays();
});

$scope.calculateNoSmokingDays = function() {
 var savedTime = parseInt(window.localStorage.getItem("savedTime"));
  var currentTime = Date.now();
  $scope.days += parseInt((currentTime - savedTime) / (86400000));
  //For testing purposes: Once app closed, then reopened after 1 minute, this will add to the days
  // $scope.days += parseInt((currentTime - savedTime) / (60000));
  days = window.localStorage.getItem("days");
  window.localStorage.setItem("days", days + $scope.days);
};

});

/* Second controller */
smokApp.controller('startController', function($scope, $state){
  if(window.localStorage.getItem("moneySpent") != undefined) {
    $state.go('mainpage');
  }
  /* Set money spent */
  $scope.saveMoneyData = function(moneySpent) {
    window.localStorage.setItem("moneySpent", moneySpent);
    $state.go('mainpage');
  };

});

smokApp.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    document.addEventListener("resume", function() {
      $rootScope.$broadcast('cordovaResumeEvent');
    });
  });
});

}());
