// Global vars
var radius = 3;
var sep = 7;
var currentCenter;
var canvas;
var timerObj;
var lifeState;

// State class
class PlaneConfig {
  constructor(list) {
    this.__data = list;
  }
  
  // Iterators are not widespread so... weird notation
  possibleX() {
    return this.__data;
  }
  possibleYfor(x) {
    return this.__data[x.toString()];
  }

  add(x,y) {
    x = x.toString();
    y = y.toString();
    
    if(this.__data[x] === undefined){
      this.__data[x] = {};
    }
    this.__data[x][y] = 1;
  }

  has(x,y) {
    x = x.toString();
    y = y.toString();
    
    if(this.__data[x] === undefined) return 0;
    if(this.__data[x][y] === undefined) return 0;
    return 1;
  }
  
  neighCount(x,y) {
    return this.has(x-1,y  ) + this.has(x+1,y  ) +
           this.has(x  ,y-1) + this.has(x  ,y+1) +
           this.has(x-1,y-1) + this.has(x+1,y+1) +
           this.has(x-1,y+1) + this.has(x+1,y-1);
  }
}






function reDraw() { 
  paper.project.activeLayer.removeChildren();
  
  for(x in lifeState.possibleX())
    for(y in lifeState.possibleYfor(x)) {
      var path = new paper.Path.Circle({
        center: new paper.Point(parseInt(x)*sep + currentCenter.x, 
                                parseInt(y)*sep + currentCenter.y),
        radius: radius,
        fillColor: 'red'
      });
    }
    
  paper.view.draw();
}





function updateState() {
  newState = new PlaneConfig({});
  
  var x, strx, y, stry, i, neig;

  
  for(strx in lifeState.possibleX()) {
    x = parseInt(strx);
    for(stry in lifeState.possibleYfor(x)) {
      y = parseInt(stry);
      
      // Check if it should die (if is already computed we can bypass it)
      if(!newState.has(x,y)) {
        neig = lifeState.neighCount(x,y);
        if((neig==2) || (neig==3)) newState.add(x,y);
      }
      
      
      // Now let's see what happens with the neigbours...
      points = [[x-1,y  ], [x+1,y  ], [x  ,y-1], [x  ,y+1], 
                [x-1,y-1], [x+1,y+1], [x-1,y+1], [x+1,y-1]];
      for(i=0; i<points.length; i++) {
        var pto = points[i];
        if(!newState.has(pto[0],pto[1])) // we can bypass the already computed ones
          if(lifeState.neighCount(pto[0],pto[1]) == 3)
            newState.add(pto[0], pto[1]);
      }
    }
  }
  lifeState = newState;
}


function oneEpoch() {
  updateState();
  reDraw();
}



// Entry point
$(document).ready(function() {
  // Initial state
  lifeState = new PlaneConfig({'0':{'-1':1, '1':1}, '-1':{'-1':1}, '1':{'0':1,'-1':1}});

  // Create an empty project and a view for the canvas:
  paper.setup('world');
  
  // Save current center
  currentCenter = paper.view.center;
  
  // Event handlers
  paper.view.onMouseDrag = function(event) {
    layer = paper.project.activeLayer;
    layer.position.x += event.delta.x;
    layer.position.y += event.delta.y;
    currentCenter.x += event.delta.x;
    currentCenter.y += event.delta.y;
  }

  
  reDraw();
  timerObj = setInterval(oneEpoch, 100);
  
});


