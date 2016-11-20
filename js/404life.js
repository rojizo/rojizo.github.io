var radius = 3;
var sep = 7;

var currentCenter;

function Draw() {  
  for(x in lifeState)
    for(y in lifeState[x]) {
      x = parseInt(x)*sep; y = parseInt(y)*sep;
      var path = new Path.Circle({
        center: new Point(x, y) + currentCenter,
        radius: radius,
        fillColor: 'red'
      });
    }
}


function onMouseDrag(event) {
  layer = project.activeLayer;
  layer.position += event.delta;
  currentCenter += event.delta;
}


function belongsTo(x,y,arr) {
  if(arr[x] === undefined) return false;
  if(arr[x][y] === undefined) return false;
  return true;
}

function numberNeigh(x,y) {
  return belongsTo(x-1,y  ,lifeState) + belongsTo(x+1,y  ,lifeState) +
         belongsTo(x  ,y-1,lifeState) + belongsTo(x  ,y+1,lifeState) +
         belongsTo(x-1,y-1,lifeState) + belongsTo(x+1,y+1,lifeState) +
         belongsTo(x-1,y+1,lifeState) + belongsTo(x+1,y-1,lifeState);
}

function updateState() {
  newState = {};
  
  var x, y, i, neig;
  
  for(x in lifeState) 
    for(y in lifeState[x]) {
      x = parseInt(x); y = parseInt(y);
      
      // Check if it should die
      if(!belongsTo(x, y, newState)){
        neig = numberNeigh(x, y);
        if((1<neig) && (neig<4)){
          if(newState[x] === undefined) newState[x] = {};
          newState[x][y] = 1;
        }
      }
      
      // Now let's see what happends with the neigbours... We should only 
      // process those not in lifeState
      points = [[x-1,y  ], [x+1,y  ], [x  ,y-1], [x  ,y+1], [x-1,y-1], 
                [x+1,y+1], [x-1,y+1], [x+1,y-1]];
      for(i=0; i<points.length; i++ ) {
        var pto = points[i]
        if(!belongsTo(pto[0], pto[1], lifeState))
          if(!belongsTo(pto[0], pto[1], newState))
            if(numberNeigh(pto[0], pto[1]) == 3){
              if(newState[pto[0]] === undefined) newState[pto[0]] = {};
              newState[pto[0]][pto[1]] = 1;
            }
      }
    }
  
  lifeState = newState;
}


function oneEpoch() {
  updateState();
  project.activeLayer.removeChildren();
  Draw();
}

var lifeState = {0:{0:1,'-1':1,1:1}};

var timerObj;


// Entry point
$(function(){
  currentCenter = view.center;
  Draw();
  timerObj = setInterval(oneEpoch, 100);
});
