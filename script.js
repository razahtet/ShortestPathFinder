var city = document.getElementById("city");
var box = document.getElementById("box");
var canvas = document.getElementById("canvas");
var losAngeles = document.getElementById("losAngeles");
var sacramento = document.getElementById("sacramento");
var findShortestPath = document.getElementById("findShortestPath");
var city1 = document.getElementById("city1");
var city2 = document.getElementById("city2");
var paths = document.getElementById("paths");
var showAll = document.getElementById("showAll");
canvas.addEventListener("mousedown", makeAPoint);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseover", startDrawing);
canvas.addEventListener("mouseout", stopDrawing);
findShortestPath.addEventListener("click", findDistance);
losAngeles.addEventListener("click", setUpAngeles);
sacramento.addEventListener("click", setUpSacramento);
showAll.addEventListener("change", function() {
    for (var i = 0; i < paths.children.length; i++) {
        showOnOff(paths.children[i]);
    }
});
var cityObject = {};
var numOfLines = 0;
var preDrawnPathCanvas = null;
var shortArray = [];
var selectN = {
  first: "",
  second: ""
}
city.focus();

function startDrawing() {
    canvas.getContext("2d").beginPath();
}

function makeAPoint(event) {
    let cityN = city.value.trim();
    if (cityN != "" && cityObject[cityN] == undefined) {
        var x = event.offsetX;
        var y = event.offsetY;
        var cityDiv = document.createElement("div");
        var nameDiv = document.createElement("div");
        nameDiv.innerHTML = cityN;
        cityDiv.classList.add("city");
        nameDiv.classList.add("cityName");
        cityDiv.style.left = x + "px";
        cityDiv.style.top = y + "px";
        nameDiv.style.left = x - cityN.length * 2 + "px";
        nameDiv.style.top = y + 21 + "px";
        cityObject[cityN] = {};
        cityObject[cityN]["taken"] = true;
        cityObject[cityN]["x"] = x;
        cityObject[cityN]["y"] = y;
        cityObject[cityN]["citOd"] = cityDiv;
        cityObject[cityN]["lines"] = []; 
        cityDiv.addEventListener("click", function() {
            deleteShortStuff();
            if (!cityDiv.classList.contains("selected")) {
                cityDiv.classList.add("selected");
                cityObject[cityN]["selected"] = true;
                // if (cityObject[cityN]["selected"] == true) {
                    if (selectN["first"] == "") {
                        selectN["first"] = cityN;
                        selectN["firstX"] = cityObject[cityN]["x"];
                        selectN["firstY"] = cityObject[cityN]["y"];
                        selectN["classO"] = cityObject[cityN]["citOd"];
                    } else {
                        selectN["second"] = cityN;
                        selectN["secondX"] = cityObject[cityN]["x"];
                        selectN["secondY"] = cityObject[cityN]["y"];
                        selectN["classP"] = cityObject[cityN]["citOd"];
                        if (!drawALine(
                            selectN["firstX"],
                            selectN["firstY"],
                            selectN["secondX"],
                            selectN["secondY"],
                            selectN["first"],
                            selectN["second"],
                            selectN["classO"],
                            selectN["classP"]
                        )) {
                            selectN["classO"].classList.remove("selected");
                            selectN["classP"].classList.add("selected");
                            console.log(selectN["classO"], selectN["classP"]);
                            cityObject[selectN["first"]]["selected"] = false;
                            cityObject[selectN["second"]]["selected"] = true;
                            selectN["first"] = selectN["second"];
                            selectN["firstX"] = selectN["secondX"];
                            selectN["firstY"] = selectN["secondY"];
                            selectN["classO"] = selectN["classP"];
                            selectN["second"] = "";
                            delete selectN["secondX"]
                            delete selectN["secondY"]
                            delete selectN["classP"]; 
                        } else {
                          selectN = {
                            first: "",
                            second: ""
                          }
                        }             
                    }
                // }
            } else {
                cityDiv.classList.remove("selected");
                cityObject[cityN]["selected"] = false;
            }
        });
        box.appendChild(cityDiv);
        box.appendChild(nameDiv);
        city.value = "";
        deleteShortStuff();
    }
}

function drawALine(fPx, fPy, sPx, sPy, firstObject, secondObject, citOb, citObj) {
    var condition = false;
    for (var i = 0; i < cityObject[firstObject]["lines"].length; i++) {
        if (cityObject[firstObject]["lines"][i].destination == secondObject) {
            condition = true;
            break;
        }
    }
    console.log(condition);
    if (condition != true) {
        deleteShortStuff();
        drawLine(fPx, fPy, sPx, sPy, "black", 1)
        let couT = firstObject;
        let couT2 = secondObject;
        for (var i = 0; i < 2; i++) {
          cityObject[couT]["lines"].push({
            length: Math.sqrt(
                Math.pow(cityObject[secondObject]["x"] - cityObject[firstObject]["x"],2) +
                Math.pow(cityObject[secondObject]["y"] - cityObject[firstObject]["y"],2)).toFixed(2),
            destination: couT2
          });
          couT2 = firstObject;
          couT = secondObject;
        }  
        numOfLines += 1;
        cityObject[firstObject]["selected"] = false;
        cityObject[secondObject]["selected"] = false;
        citOb.classList.remove("selected");
        citObj.classList.remove("selected");
        return true;
    } else {
        console.log("other");
        return false;
    }
}

function stopDrawing() {
    canvas.getContext("2d").closePath();
}

function findDistance() {
    deleteShortStuff();
    paths.innerHTML = "";
    var firstCity = city1.value.trim();
    var secondCity = city2.value.trim();
    if (cityObject[firstCity] != undefined) {
        if (cityObject[secondCity] != undefined) {
            let condition = false;
            let shortestLen = {
                value: Infinity,
                pathS: ""
            }
            let gotBack = findPaths(firstCity, secondCity, 0, [], []); // gotBack should be an array of path objects
            shortArray = [];
            if (gotBack != "") {
                condition = true;
                for (var i = 0; i < gotBack.length; i++) {
                    let pathO = document.createElement("div");
                    for (var j = 0; j < gotBack[i].citysVisited.length; j++) {
                        pathO.innerHTML = pathO.innerHTML + gotBack[i].citysVisited[j] + " - ";
                    }
                    pathO.innerHTML = pathO.innerHTML.replace(/-\s*$/, "");
                    pathO.innerHTML = pathO.innerHTML + "(" + gotBack[i].length + " units)";
                    if (parseFloat(gotBack[i].length, 10) < parseFloat(shortestLen.value, 10)) {
                        shortestLen.value = gotBack[i].length;
                        shortestLen.pathS = pathO;
                        shortArray = [];
                        for (var j = 0; j < gotBack[i].citysVisited.length; j++) {
                          shortArray.push(gotBack[i].citysVisited[j]);
                        }
                    }
                    pathO.classList.add("path");
                    showOnOff(pathO);
                    paths.appendChild(pathO);
                }
                if (shortestLen.pathS != "") {
                    shortestLen.pathS.classList.remove("hidden");
                    shortestLen.pathS.classList.add("shortest"); 
                    for (var i = 0; i < shortArray.length; i++) {
                      cityObject[shortArray[i]]["citOd"].classList.add("highlighted");
                    }
                    drawShortestPath();
                } else {
                    paths.innerHTML = "";
                    condition = false;
                }
            }
            if (condition != true) {
                paths.innerHTML = "There is no line between the two points.";
            }
        } else {
            paths.innerHTML = "Destination City is Not on Map";
        }
    } else {
        paths.innerHTML = "Starting City is Not on Map";
    }
    window.scrollTo(0, document.body.scrollHeight);
}

function findPaths(place1, place2, length, pathArray, pathE) {
    if (place1 == place2) {
        pathE.push(place1);
        pathArray.push({
            citysVisited: pathE,
            length: length.toFixed(2)
        });
    } else {
        recurS: for (var i = 0; i < cityObject[place1]["lines"].length; i++) {
            let destiny = cityObject[place1]["lines"][i]["destination"];
            if (!pathE.includes(destiny)) {
                var thisPath = pathE.slice();
                thisPath.push(place1);
                var tryA = findPaths(destiny, place2, length + parseFloat(cityObject[place1]["lines"][i]["length"], 10), pathArray, thisPath);
            }
        }
    }
    return pathArray;
}

function setUpAngeles() {
  deleteShortStuff();
  clearMap();
  addPoint("Los Angeles", 11, 11);
  addPoint("Long Beach", 47, 94);
  addPoint("Anaheim", 130, 67);
  addPoint("Irvine", 162, 155);
  addPoint("San Bernardino", 339, 9);
  addPoint("Palm Springs", 482, 110);
  addPoint("San Diego", 303, 359);
  
  drawALine(11, 11, 47, 94, "Los Angeles", "Long Beach", cityObject["Los Angeles"]["citOd"], cityObject["Long Beach"]["citOd"]);
  drawALine(11, 11, 130, 67, "Los Angeles", "Anaheim", cityObject["Los Angeles"]["citOd"], cityObject["Anaheim"]["citOd"]);
  drawALine(11, 11, 339, 9, "Los Angeles", "San Bernardino", cityObject["Los Angeles"]["citOd"], cityObject["San Bernardino"]["citOd"]);
  drawALine(130, 67, 339, 9, "Anaheim", "San Bernardino", cityObject["Anaheim"]["citOd"], cityObject["San Bernardino"]["citOd"]);
  drawALine(47, 94, 130, 67, "Long Beach", "Anaheim", cityObject["Long Beach"]["citOd"], cityObject["Anaheim"]["citOd"]);
  drawALine(130, 67, 162, 155, "Anaheim", "Irvine", cityObject["Anaheim"]["citOd"], cityObject["Irvine"]["citOd"]);
  drawALine(162, 155, 339, 9, "Irvine", "San Bernardino", cityObject["Irvine"]["citOd"], cityObject["San Bernardino"]["citOd"]);
  drawALine(339, 9, 482, 110, "San Bernardino", "Palm Springs", cityObject["San Bernardino"]["citOd"], cityObject["Palm Springs"]["citOd"]);
  drawALine(482, 110, 303, 359, "Palm Springs", "San Diego", cityObject["Palm Springs"]["citOd"], cityObject["San Diego"]["citOd"]);
  drawALine(162, 155, 303, 359, "Irvine", "San Diego", cityObject["Irvine"]["citOd"], cityObject["San Diego"]["citOd"]);
}

function setUpSacramento() {
  deleteShortStuff();
  clearMap();
  addPoint("El Dorado Hills", 481, 205);
  addPoint("Elk Grove", 310, 386);
  addPoint("Fair Oaks", 382, 241);
  addPoint("Folsom", 415, 215);
  addPoint("Pleasant Grove", 139, 136);
  addPoint("Rancho Cordova", 357, 283);
  addPoint("Sacramento", 208, 278);
  addPoint("Sacramento International Airport", 84, 239);
  addPoint("Yuba City", 86, 9);

  drawALine(481, 205, 415, 215, "El Dorado Hills", "Folsom", cityObject["El Dorado Hills"]["citOd"], cityObject["Folsom"]["citOd"]);
  drawALine(415, 215, 382, 241, "Folsom", "Fair Oaks", cityObject["Folsom"]["citOd"], cityObject["Fair Oaks"]["citOd"]);
  drawALine(382, 241, 357, 283, "Fair Oaks", "Rancho Cordova", cityObject["Fair Oaks"]["citOd"], cityObject["Rancho Cordova"]["citOd"]);
  drawALine(357, 283, 310, 386, "Rancho Cordova", "Elk Grove", cityObject["Rancho Cordova"]["citOd"], cityObject["Elk Grove"]["citOd"]);
  drawALine(357, 283, 208, 278, "Rancho Cordova", "Sacramento", cityObject["Rancho Cordova"]["citOd"], cityObject["Sacramento"]["citOd"]);
  drawALine(310, 386, 208, 278, "Elk Grove", "Sacramento", cityObject["Elk Grove"]["citOd"], cityObject["Sacramento"]["citOd"]);
  drawALine(208, 278, 84, 242, "Sacramento", "Sacramento International Airport", cityObject["Sacramento"]["citOd"], cityObject["Sacramento International Airport"]["citOd"]);
  drawALine(84, 242, 139, 136, "Sacramento International Airport", "Pleasant Grove", cityObject["Sacramento International Airport"]["citOd"], cityObject["Pleasant Grove"]["citOd"]);
  drawALine(208, 278, 139, 136, "Sacramento", "Pleasant Grove", cityObject["Sacramento"]["citOd"], cityObject["Pleasant Grove"]["citOd"]);
  drawALine(139, 136, 86, 9, "Pleasant Grove", "Yuba City", cityObject["Pleasant Grove"]["citOd"], cityObject["Yuba City"]["citOd"]);
  drawALine(86, 9, 481, 205, "Yuba City", "El Dorado Hills", cityObject["Yuba City"]["citOd"], cityObject["El Dorado Hills"]["citOd"]);
  drawALine(481, 205, 139, 136, "El Dorado Hills", "Pleasant Grove", cityObject["El Dorado Hills"]["citOd"], cityObject["Pleasant Grove"]["citOd"]);
  drawALine(415, 215, 139, 136, "Folsom", "Pleasant Grove", cityObject["Folsom"]["citOd"], cityObject["Pleasant Grove"]["citOd"]);
  drawALine(382, 241, 139, 136, "Fair Oaks", "Pleasant Grove", cityObject["Fair Oaks"]["citOd"], cityObject["Pleasant Grove"]["citOd"]);
  drawALine(481, 205, 310, 386, "El Dorado Hills", "Elk Grove", cityObject["El Dorado Hills"]["citOd"], cityObject["Elk Grove"]["citOd"]);

}

function addPoint(name, x, y) {
    if (cityObject[name] == undefined) {
        var cityDiv = document.createElement("div");
        var nameDiv = document.createElement("div");
        nameDiv.innerHTML = name;
        cityDiv.classList.add("city");
        nameDiv.classList.add("cityName");
        cityDiv.style.left = x + "px";
        cityDiv.style.top = y + "px";
        nameDiv.style.left = x - name.length * 2 + "px";
        nameDiv.style.top = y + 21 + "px";
        cityObject[name] = {};
        cityObject[name]["taken"] = true;
        cityObject[name]["x"] = x;
        cityObject[name]["y"] = y;
        cityObject[name]["citOd"] = cityDiv;
        cityObject[name]["lines"] = [];
        cityDiv.addEventListener("click", function() {
            if (!cityDiv.classList.contains("selected")) {
                cityDiv.classList.add("selected");
                cityObject[name]["selected"] = true;
                let selectN = {
                    first: "",
                    second: ""
                };
                for (var city in cityObject) {
                    if (cityObject[city]["selected"] == true) {
                        if (selectN["first"] == "") {
                            selectN["first"] = city;
                            selectN["firstX"] = cityObject[city]["x"];
                            selectN["firstY"] = cityObject[city]["y"];
                            selectN["classO"] = cityObject[city]["citOd"];
                        } else {
                            selectN["second"] = city;
                            selectN["secondX"] = cityObject[city]["x"];
                            selectN["secondY"] = cityObject[city]["y"];
                            selectN["classP"] = cityObject[city]["citOd"];
                            drawALine(
                                selectN["firstX"],
                                selectN["firstY"],
                                selectN["secondX"],
                                selectN["secondY"],
                                selectN["first"],
                                selectN["second"],
                                selectN["classO"],
                                selectN["classP"]
                            );
                            break;
                        }
                    }
                }
            } else {
                cityDiv.classList.remove("selected");
                cityObject[name]["selected"] = false;
            }
        });
        box.appendChild(cityDiv);
        box.appendChild(nameDiv);
    }
}

function showOnOff(object) {
    if (showAll.checked == false) {
        if (!object.classList.contains("shortest")) {
            object.classList.add("hidden")
        }
    } else {
        object.classList.remove("hidden");
    }
}

function deleteShortStuff() {
  for (var objE in cityObject) {
    if (cityObject[objE]["citOd"].classList.contains("highlighted")) {
      cityObject[objE]["citOd"].classList.remove("highlighted");
    }
  }
  if (preDrawnPathCanvas != null) {
    canvas.getContext("2d").putImageData(preDrawnPathCanvas, 0, 0);
  }
  shortArray = [];
  preDrawnPathCanvas = null;
}

function clearMap() {     
  while (box.querySelectorAll("div").length > 0) {         
    box.removeChild(box.querySelectorAll("div")[0]);     
  }      
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);      
  paths.innerHTML = "";      
  cityObject= {};
  city1.value = "";
  city2.value = "";
  preDrawnPathCanvas = null; 
}

function drawShortestPath() {     
  preDrawnPathCanvas = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);      
  for (var i = 0; i < shortArray.length; i++) {         
    var cityDivX = cityObject[shortArray[i]]["x"];
    var cityDivY = cityObject[shortArray[i]]["y"];
    cityObject[shortArray[i]]["citOd"].classList.add("highlighted");          
    if (i < shortArray.length - 1) {             
      var city2DivX = cityObject[shortArray[i + 1]]["x"];
      var city2DivY = cityObject[shortArray[i + 1]]["y"];
      drawLine(cityDivX, cityDivY, city2DivX, city2DivY, "orange", "5"); 
    }     
  } 
}

function drawLine(x1, y1, x2, y2, color, width) {
  startDrawing();
  canvas.getContext("2d").moveTo(x1 + 10, y1 + 7);    
  canvas.getContext("2d").lineTo(x2 + 10, y2 + 7);     
  canvas.getContext("2d").strokeStyle = color;     
  canvas.getContext("2d").lineWidth = width;     
  canvas.getContext("2d").stroke();     
  stopDrawing();
}
