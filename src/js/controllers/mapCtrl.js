'use strict';

angular.module('mainscreen').controller('mapCtrl', ['$scope', 'mapFactory', function($scope, mapFactory){

  $scope.pageTitle = "SUPER JANKY RPG";
  $scope.mapInfo = mapFactory.displayMap;
  if($scope.mapInfo.length != mapFactory.mapSize)
  {
    mapFactory.buildMap();
    $scope.mapInfo = mapFactory.displayMap;
  }
  $scope.playerLoc = mapFactory.playerLoc;
  
  $scope.buttondown = false;
  
  $scope.move = function(dir){
   //if($scope.buttondown == false)
   // {
      if(dir == "N" || (dir>=55 && dir <=57)){$scope.playerLoc[0]=$scope.playerLoc[0]-1;}
      if(dir == "S" || (dir>=49 && dir <=51)){$scope.playerLoc[0]=$scope.playerLoc[0]+1;} 
      if(dir == "W" || dir==52 || dir==55 || dir==49){$scope.playerLoc[1]=$scope.playerLoc[1]-1;} 
      if(dir == "E" || dir==54 || dir==57 || dir==51){$scope.playerLoc[1]=$scope.playerLoc[1]+1;}
      if($scope.playerLoc[0] < 0){$scope.playerLoc[0] = 0;}
      if($scope.playerLoc[0] > mapFactory.mapSize-1){$scope.playerLoc[0] = mapFactory.mapSize-1;}
      if($scope.playerLoc[1] < 0){$scope.playerLoc[1] = 0;}
      if($scope.playerLoc[1] > mapFactory.mapSize-1){$scope.playerLoc[1] = mapFactory.mapSize-1;}
    //}
    $scope.buttondown = true;
  };
  
  $scope.release = function()
  {
    $scope.buttondown = false;
  }
  
}]);