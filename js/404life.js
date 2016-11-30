"use strict";

////////////////////////////////////////////////////////////////
// Global vars                                                //
////////////////////////////////////////////////////////////////
var radius = 3;
var sep = 7;
var currentCenter;
var timerObj;
var lifeState;
var playTool;
var stopTool;


////////////////////////////////////////////////////////////////
// State class                                                //
////////////////////////////////////////////////////////////////
class PlaneConfig {
  constructor(list) {
    this.__data = list;
  }
  
  del(x,y) {
    x = x.toString();
    y = y.toString();
    
    if(typeof(this.__data[x]) == 'undefined') return;
    delete this.__data[x][y];
    if( this.__data[x].length == 0 ) delete this.__data[x];
  }
  
  add(x,y) {
    x = x.toString();
    y = y.toString();
    
    if(typeof(this.__data[x]) == 'undefined'){
      this.__data[x] = {};
    }
    this.__data[x][y] = 1;
  }

  has(x,y) {
    x = x.toString();
    y = y.toString();
    
    if(typeof(this.__data[x]) == 'undefined') return 0;
    if(typeof(this.__data[x][y]) == 'undefined') return 0;
    return 1;
  }
  
  neighCount(x,y) {
    return this.has(x-1,y  ) + this.has(x+1,y  ) +
           this.has(x  ,y-1) + this.has(x  ,y+1) +
           this.has(x-1,y-1) + this.has(x+1,y+1) +
           this.has(x-1,y+1) + this.has(x+1,y-1);
  }
  
  draw(color) {
    paper.project.activeLayer.removeChildren();
    color = (typeof(color) !== 'undefined')?color:'red';
    
    for(var x in this.__data)
      for(var y in this.__data[x]) {
        new paper.Path.Circle({
          center: new paper.Point(parseInt(x)*sep + currentCenter.x, 
                                  parseInt(y)*sep + currentCenter.y),
          radius: radius,
          fillColor: color
        });
      }
    paper.view.draw();
  }
  
  evolve() {
    var newState = new PlaneConfig({});
    var strx, stry;
    
    for(strx in this.__data) {
      var x = parseInt(strx);
      for(stry in this.__data[strx]) {
        var y = parseInt(stry);
        
        // Check if it should die (if is already computed we can bypass it)
        if(!newState.has(x,y)) {
          var neig = this.neighCount(x,y);
          if((neig==2) || (neig==3)) newState.add(x,y);
        }
        
        // Now let's see what happens with the neigbours...
        var points = [[x-1,y  ], [x+1,y  ], [x  ,y-1], [x  ,y+1], 
                      [x-1,y-1], [x+1,y+1], [x-1,y+1], [x+1,y-1]];
        var i;
        for(i=0; i<points.length; i++) {
          var pto = points[i];
          if(!newState.has(pto[0],pto[1])){ // we can bypass the already computed ones
            var neigh = this.neighCount(pto[0],pto[1]);
            if(neigh == 3) newState.add(pto[0], pto[1]);
          }
        }
      }
    }
    this.__data = newState.__data;
  }
}


////////////////////////////////////////////////////////////////
// Aux funcs                                                  //
////////////////////////////////////////////////////////////////

function oneEpoch() {
  lifeState.evolve();
  lifeState.draw();
}

function Play() {
  playTool.activate();
  timerObj = setInterval(oneEpoch, 100);
}

function Stop() {
  clearInterval(timerObj);
  stopTool.activate();
}


////////////////////////////////////////////////////////////////
// Event handlers                                             //
////////////////////////////////////////////////////////////////
function tools_onMouseDrag(event) {
  paper.project.activeLayer.position.x += event.delta.x;
  paper.project.activeLayer.position.y += event.delta.y;
  currentCenter.x += event.delta.x;
  currentCenter.y += event.delta.y;
}

function playTool_onKeyUp(event) {
  if(event.key == 'space')
    Stop();
  else
    stopTool_onKeyUp(event);
}

function stopTool_onKeyUp(event) {
  switch(event.key){
  case 'c':
    lifeState = new PlaneConfig({});
    break;
  case '+':
    sep = 2*(++radius)+1; 
    break;
  case '-':
    if(radius>1) sep = 2*(--radius)+1;
    break;
  case 'space':
    Play();
    return;
  }
  lifeState.draw();
}

function stopTool_onMouseUp(event) {
  if((event.delta.x == 0)&&(event.delta.y == 0)) { // you are not dragging
    var x = Math.round((event.point.x - currentCenter.x)/sep);
    var y = Math.round((event.point.y - currentCenter.y)/sep);
    
    if(lifeState.has(x,y))
      lifeState.del(x,y);
    else
      lifeState.add(x,y);
    lifeState.draw();
  }
}



////////////////////////////////////////////////////////////////
// Entry point                                                //
////////////////////////////////////////////////////////////////
$(document).ready(function() {
  // Initial state
  lifeState = new PlaneConfig({'0':{'-1':1, '1':1}, '-1':{'-1':1}, '1':{'0':1,'-1':1}});
  
  // Create an empty project and a view for the canvas:
  paper.setup('world');
  
  // Save current center
  currentCenter = paper.view.center;
  
  
  // Setup tools
  playTool = new paper.Tool();
  stopTool = new paper.Tool();
  
  // Add events
  playTool.onMouseDrag = tools_onMouseDrag;
  playTool.onKeyUp = playTool_onKeyUp;
  //stopTool.onMouseDrag = tools_onMouseDrag;
  stopTool.onMouseUp = stopTool_onMouseUp;
  stopTool.onKeyUp = stopTool_onKeyUp;
  
  // Draw inital state
  lifeState.draw();
  
  // Activate default tool
  Play();
});


