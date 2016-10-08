angular.module("mainscreen").factory("mapFactory",["$http",function($http)
{
  return {
    mapSize: 100,
    elevationModifier: -3, //The lower this is, the more ocean tends to appear on the map.
    iceHeight: 7, //The elevation past which temperatures start dropping.
    mountainStart: 6, //The elevation at which land gets counted as mountainous.
    swampStart: 3, //The humidity that sea level land gets counted as swampy.
    forestStart: 2, //The humidity that meadowland gets counted as forested.
    polarCapRatio: 12, //The divisor used to determine the polar cap size based on map size. Larger = smaller caps.
    desertification: -6, //The humidity below which beaches and deserts form.
    jungleStart: function(){return (this.mapSize / 4) +4;}, //The temperature at which forests begin to be set as jungles.
    playerLoc: [1,1],
    randomNum: function(min, max){
      var temp = 0;
      if(min > max)
      {
        temp = min;
        min = max;
        max = temp;
      }
      return Math.floor(Math.random() * ((max-min)+1)) + min;
    },
    buildMap_OLD: function(){
              //The old map. Assigns colors to squares at random.
              this.mapInfo = [];
              for(var x=0;x<this.mapSize;x++)
              {
                var subRow = [];
                for(var y=0;y<this.mapSize;y++)
                {
                  var arrMapColors = ["green","green","green","darkGreen","blue","blue","blue","blue","blue","red","purple"];
                  var randy = this.randomNum(0,arrMapColors.length-1);
                  subRow.push(arrMapColors[randy]);
                  //if(randy == 1){subRow.push("green");}
                  //if(randy == 2){subRow.push("blue");}
                  //if(randy == 3){subRow.push("red");}
                }
                this.mapInfo.push(subRow);
              }
              //this.mapInfo = [["green","blue","green"],
              //["blue","red","green"],
              //["red","green","green"]];
              },
    determineLandscape: function(){
              //Actually sets the landscape to the various parameters currently stashed as a subarray in the map info array, and stores the result in the display map array.
              this.displayMap = [];
              for(var x=0;x<this.mapSize;x++)
              {
                var subRow = [];
                for(var y=0;y<this.mapSize;y++)
                {
                  var thisEle = this.mapInfo[x][y][0];
                  var thisHumid = this.mapInfo[x][y][1];
                  var thisTemp = this.mapInfo[x][y][2];
                  if(thisTemp <= 0 && thisEle < this.mountainStart){
                    subRow.push("icePlains");
                  }
                  else if(thisTemp <= 0)
                  {
                    subRow.push("snowMountain");
                  }
                  else if(thisEle < -3)
                  {
                    subRow.push("deepOcean");
                  }
                  else if(thisEle < 1)
                  {
                    subRow.push("shallowOcean");
                  }
                  else if(thisEle == 1)
                  {
                    if(thisHumid > this.swampStart)
                    {
                      subRow.push("swamp");
                    }
                    else if(thisHumid < this.desertification)
                    {
                      subRow.push("beach");
                    }
                    else
                    {
                      subRow.push("meadow");
                    }
                  }
                  else if(thisEle < this.mountainStart)
                  {
                    if(thisHumid > this.forestStart)
                    {
                      if(thisTemp < this.jungleStart())
                      {
                        subRow.push("forest");
                            
                      }
                      else
                      {
                        subRow.push("jungle");
                      }
                    }
                    else if(thisHumid < this.desertification)
                    {
                      subRow.push("desert");
                    }
                    else
                    {
                      subRow.push("meadow");
                    }
                  }
                  else if(thisEle >= this.mountainStart && thisHumid <= this.forestStart)
                  {
                    subRow.push("mountain");
                  }
                  else if(thisEle >= this.mountainStart && thisHumid > this.forestStart)
                  {
                    subRow.push("woodedMountain");
                  }
                }
                this.displayMap.push(subRow);
              }
            },
    buildMap: function(){
                   //Creates a pseudo-elevation map and assigns colors to it by elevation. Elevation is determined by the elevation of previously-placed
                   //adjacent squares plus some randomness to jumpstart the whole process. Currently this means the top left of the map should always
                   //be somewhat shallow, and the bottom right has the highest extremity potential.
                   //At the same time, the map generates humidity levels in the same fashion. (Yeah, so you can get 'dry' oceans. This might be updated
                   //later.) Humidity alters certain terrain - high humidity at around sea level creates purple swamps. somewhat high humidity in the 
                   //'grasslands' range of elevation results in dark green forests. And arid grasslands/lowlands become yellow sand tiles for deserts and beaches.
                   this.mapInfo = [];
                   for(var x=0;x<this.mapSize;x++)
                   {
                     var subRow = [];
                     for(var y=0;y<this.mapSize;y++)
                     {
                       var prevXEle = this.elevationModifier;
                       var prevYEle = this.elevationModifier;
                       var minEle = 0;
                       var maxEle = 0;
                       var prevXHumid = 0;
                       var prevYHumid = 0;
                       var minHumid = 0;
                       var maxHumid = 0;
                       if(x > 0)
                       {
                         prevXEle = this.mapInfo[x-1][y][0];
                         prevXHumid = this.mapInfo[x-1][y][1];;
                       }
                       if(y > 0)
                       {
                         prevYEle = subRow[y-1][0];
                         prevYHumid = subRow[y-1][1];;
                       }
                       minEle = prevXEle;
                       maxEle = prevYEle;
                       if(prevXEle > prevYEle)
                       {
                         minEle = prevYEle;
                         maxEle = prevXEle;
                       }
                       minHumid = prevXHumid;
                       maxHumid = prevYHumid;
                       if(prevXHumid > prevYHumid)
                       {
                         minHumid = prevYHumid;
                         maxHumid = prevXHumid;
                       }
                       //console.log(minEle+", "+maxEle);
                       var randEle = this.randomNum(minEle-2,maxEle+2);
                       var randHumid = this.randomNum(minHumid-2,maxHumid+2);
                       var staticTemp = 0 - (this.mapSize / this.polarCapRatio) + x;
                       if(x > (this.mapSize / 2))
                       {
                         staticTemp = this.mapSize - (x+1) - (this.mapSize / this.polarCapRatio);
                       }
                       if(randEle >= this.iceHeight)
                       {
                         staticTemp-=(randEle-(this.iceHeight))*((this.mapSize/20)+1);
                       }
                       staticTemp += this.randomNum(-1,1); //for properly-jagged ice caps.
                       //console.log(x + ", "+ y+": "+randy);
                       subRow.push([randEle,randHumid,staticTemp,[]]);
                     }
                     this.mapInfo.push(subRow);
                   }
                   this.determineLandscape();
                   this.fillMonsterHabitat();
                 },
    fillMonsterHabitat: function(){
        //Sets habitats for monsters around the world. A starting population is placed for each monster, and then the spread of that monster is calculated so it 
        //fills to its preferred environment based on its spread range.
        var thisEle = -255;
        var thisHumid = -255;
        var thisTemp = -255;
        var thisMapSquare = "nothing";
        var thisX = 0;
        var thisY = 0;
        var attempts = 0;
        var changes = 1;
        
        for (var monIter = 0; monIter < this.monsterList.length; monIter++)
        {
          //Initial Placement
          thisX = this.randomNum(0,this.mapSize-1);
          thisY = this.randomNum(0,this.mapSize-1);
          thisEle = this.mapInfo[thisX][thisY][0];
          thisHumid = this.mapInfo[thisX][thisY][1];
          thisTemp = this.mapInfo[thisX][thisY][2];
          thisMapSquare =  this.displayMap[thisX][thisY];
          attempts = 0;
          changes = 1;
          while(eval(this.monsterList[monIter][3]) == false && attempts < 100)
          {
            thisX = this.randomNum(0,this.mapSize-1);
            thisY = this.randomNum(0,this.mapSize-1);
            thisEle = this.mapInfo[thisX][thisY][0];
            thisHumid = this.mapInfo[thisX][thisY][1];
            thisTemp = this.mapInfo[thisX][thisY][2];
            thisMapSquare =  this.displayMap[thisX][thisY];
            attempts++;
            changes = 1;
          }
          if(attempts < 101)
          {
            console.log("placementSuccess! Monster " + monIter + " placed at "+thisX+","+thisY+"!");
            this.mapInfo[thisX][thisY][3][monIter] = this.monsterList[monIter][1];
            //Certain monsters affect their environment. Maybe they affect the map in visible ways, or ensure another monster lives in the same environment. Eval that code here.
            eval(this.monsterList[monIter][4]);
            while(changes > 0)
            {
              changes = 0;
              for(var x=0;x<this.mapSize;x++)
              {
                for(var y=0;y<this.mapSize;y++)
                {
                  thisEle = this.mapInfo[x][y][0];
                  thisHumid = this.mapInfo[x][y][1];
                  thisTemp = this.mapInfo[x][y][2];
                  thisMapSquare =  this.displayMap[x][y];
                  if(this.mapInfo[x][y][3][monIter] != null && this.mapInfo[x][y][3][monIter] > 0)
                  {
                    var monRange = this.monsterList[monIter][2];
                    var minX = x < monRange ? 0 : (x - monRange);
                    var minY = y < monRange ? 0 : (y - monRange);
                    var maxX = (this.mapSize) - monRange < x ? (this.mapSize) : x + monRange;
                    var maxY = (this.mapSize) - monRange < y ? (this.mapSize) : y + monRange;
                    console.log("Mon "+monIter+": "+x+","+y+" spread range: "+minX+","+minY+"->"+maxX+","+maxY);
                      
                    for(var x2 = minX; x2 < maxX; x2++)
                    {
                      for(var y2 = minY; y2 < maxY; y2++)
                      {
                        thisEle = this.mapInfo[x2][y2][0];
                        thisHumid = this.mapInfo[x2][y2][1];
                        thisTemp = this.mapInfo[x2][y2][2];
                        thisMapSquare =  this.displayMap[x2][y2];
                        //If the monster hasn't already been placed on this square *and* it meets eval'd environment standards for that monster, place it.
                        if(this.mapInfo[x2][y2][3][monIter] != this.monsterList[monIter][1] && 
                        (eval(this.monsterList[monIter][3])))
                        { 
                          thisX = x2;
                          thisY = y2;
                          this.mapInfo[x2][y2][3][monIter] = this.monsterList[monIter][1];
                          //Eval the monster effects code again here.
                          eval(this.monsterList[monIter][4]);
                          changes++;
                          console.log("spreadSuccess at "+x2+","+y2+".");
                        }
                        else
                        {
                          //console.log("spreadFail at "+x2+","+y2+".");
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          else
          {
            console.log("placementFailed");
            this.mapInfo[thisX][thisY][3][monIter] = 0;
          }
        }
        console.log(this.mapInfo);
    },
    monsterList: //["MonsterName",DifficultyNumber,Range(controls spread of territory),"HabitatRequirements(As a boolean statement)","codeToExecuteOnPlacement"],
                 [["Termidian",7,3,"thisMapSquare == 'desert'","this.displayMap[thisX][thisY] = 'termites';"],
                  ["Harpfish",3,2,"thisTemp > this.jungleStart() && thisEle < 1",""],
                  ["Skunkraven",1,4,"thisMapSquare == 'forest' || thisMapSquare == 'jungle'",""],
                  ["Big Ol' Dragon",14,0,"thisEle > 7",""],
                  ["Tundra Yeti",5,2,"thisTemp < 1",""],
                 // ["Fire Yeti",6,2,"thisTemp > this.jungleStart() && thisEle > this.mountainStart",""], //This one is broken.
                  ["Carnipenguin",3,3,"thisEle < 3 && thisTemp < 2",""]],
    mapFile: "map1.dat",
    mapInfo: [["blue","green","blue","green"],
              ["green","blue","red","green"],
              ["blue","red","green","green"],
              ["green","blue","green","blue"]],
    displayMap: [["blue","green","blue","green"],
                 ["green","blue","red","green"],
                 ["blue","red","green","green"],
                 ["green","blue","green","blue"]]
  };
}]);