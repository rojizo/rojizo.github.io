"use strict";

////////////////////////////////////////////////////////////////
// Global vars                                                //
////////////////////////////////////////////////////////////////
var radius = .5;
var color = 'red';
var sep = 7;

var WORLD;


function logisticMap(a) {
  return function(x) { return a * x * (1 - x); };
}


////////////////////////////////////////////////////////////////
// Entry point                                                //
////////////////////////////////////////////////////////////////
$(document).ready(function() {
  
  // Create an empty project and a view for the canvas:
  paper.setup('world');
  
  // Save current center
  var bounds = paper.view.getBounds();
  
  WORLD = $('#world');
  
  // Initial state
  WORLD.data('lastPos', null);
  
  // Event handlers
  WORLD.on('mousedown', function(e){
    e.preventDefault();
    WORLD.data('lastPos', {x:e.clientX, y:e.clientY});
  });
  WORLD.on('mouseup', function(e){
    e.preventDefault();
    WORLD.data('lastPos', null);
  });
  WORLD.on('mousemove', function(e){
    e.preventDefault();
    var lastEvent = WORLD.data('lastPos');
    if( lastEvent !== null ){
      paper.project.activeLayer.position.x += (e.clientX - lastEvent.x) / paper.view.zoom;
      paper.project.activeLayer.position.y += (e.clientY - lastEvent.y) / paper.view.zoom;
      WORLD.data('lastPos', {x:e.clientX, y:e.clientY});
    }
  });
  WORLD.bind('mousewheel DOMMouseScroll', function(e) {
    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
      paper.view.zoom *= 1.05
    } else {
      paper.view.zoom /= 1.05
    }
  });
  
  var amin = 0;
  var amax = 4;
  var astep = 0.005;
  
  
  for(var a=amin; a<=amax; a+=astep) {
    var currentGroup = new paper.Group();
    
    var map = logisticMap(a);
    var x = Math.random();
    // Transient
    for(var i=0; i<200; i++){
      var newx = map(x);
      if(newx == x) break;
      x = newx;
    }
    // Draw!
    for(var i=0; i<100; i++) {
      var newx = map(x);
      var point = new paper.Point(
            ((a-amin)/(amax-amin)+bounds.x)*(bounds.width-20) + 10, 
            (1-x+bounds.y)*(bounds.height-20) + 10  );
      
      if(currentGroup.hitTest(point) == null){
        currentGroup.addChild(
          new paper.Path.Circle({
            center: point,
            radius: radius,
            fillColor: 'black'
          }));
      }
      
      //if( Math.abs(newx - x) < 1e-5 ) break;
      x = newx;
    }
  }
  
  
});


