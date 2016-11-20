var radius = 3;
var sep = 7;

function Draw() {
  var gridSize = 10;
  var spacing = 10;
  path  = new Path.Circle({
    center: view.center,
    radius: radius,
    fillColor: 'black'
  });

}

onResize = function(){
  path.position = view.center;
};

// Entry point
$(function(){
  var x,y;
  
  for(x=view.center.x-Math.ceil(view.size.width/2/sep)*sep; 
      x<view.size.width+sep; x+=sep )
    for(y=view.center.y-Math.ceil(view.size.width/2/sep)*sep; 
        y<view.size.width+sep; y+=sep ) {
      path = new Path.Circle(new Point(x,y), radius);
      path.strokeColor = '#CCC';
    }
    
    
  
  Draw();
});
