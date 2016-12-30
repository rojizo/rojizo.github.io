"use strict";

////////////////////////////////////////////////////////////////
// Global vars                                                //
////////////////////////////////////////////////////////////////
var RADIUS = .4;
var WORLD;
var CX;

////////////////////////////////////////////////////////////////
// Logistic map                                               //
////////////////////////////////////////////////////////////////
function logisticMap(a) {
  return function(x) { return a * x * (1 - x); };
}


////////////////////////////////////////////////////////////////
// Draw function for range                                    //
////////////////////////////////////////////////////////////////
function ComputeDrawLogistic(AMIN, AMAX, XMIN, XMAX) {
  
  CX.clearRect(0,0,WORLD.width(),WORLD.height());
  
  CX.fillStyle = "#000";
  
  var wWidth = WORLD.width();
  var wHeight = WORLD.height();
  
  var pA = (AMAX - AMIN);
  var pX = (XMAX - XMIN);
  
  var ASTEP = pA / wWidth / 2;
  
  for(var a=AMIN; a<=AMAX; a+=ASTEP) {
    var map = logisticMap(a);
    var x = Math.random() * pX + XMIN;
    
    // Transient
    for(var i=0; i<200; i++) {
      var newx = map(x);
      if(newx == x) break;
      x = newx;
    }
    
    // Draw!
    for(var i=0; i<100; i++) {
      x = map(x);
      if( (x <= XMAX) && (x >= XMIN) ){
        CX.beginPath();
        CX.arc( (a - AMIN)/pA * (wWidth - 20) + 10,
                (1 - (x - XMIN)/pX) * (wHeight - 20) + 10, 
                RADIUS, 0, 6.2831853072);
        CX.fill();
      }
    }
  }
  
  WORLD.data({ 
    'imgWOgui': CX.getImageData(0, 0, wWidth, wHeight),
    'AMAX': AMAX,
    'AMIN': AMIN,
    'XMAX': XMAX,
    'XMIN': XMIN,
  });
}

////////////////////////////////////////////////////////////////
// Events Handlers                                            //
////////////////////////////////////////////////////////////////
function mouseup(e) {
  e.preventDefault();
  
  var AMAX = WORLD.data('AMAX');
  var AMIN = WORLD.data('AMIN');
  var pA = (AMAX - AMIN);
  var XMAX = WORLD.data('XMAX');
  var XMIN = WORLD.data('XMIN');
  var pX = (XMAX - XMIN);
  var wWidth = WORLD.width();
  var wHeight = WORLD.height();
  
  var _AMAX, _AMIN, _XMIN, _XMAX;
  
  if(WORLD.data('dragging')) {
    // Ok now compute the things
    var corner0 = WORLD.data('inipos');
    
    if(WORLD.data('inipos').x > e.clientX) {
      _AMAX = (WORLD.data('inipos').x - 10) * pA / (wWidth - 20) + AMIN;
      _AMIN = (e.clientX - 10) * pA / (wWidth - 20) + AMIN;
    } else if(WORLD.data('inipos').x < e.clientX) {
      _AMAX = (e.clientX - 10) * pA / (wWidth - 20) + AMIN;
      _AMIN = (WORLD.data('inipos').x - 10) * pA / (wWidth - 20) + AMIN;
    } else {
      CX.putImageData(WORLD.data('imgWOgui'), 0, 0);
      WORLD.data('dragging', false);
      WORLD.data('inipos', null);
      return;
    }
    
    if(WORLD.data('inipos').y > e.clientY) {
      _XMIN = (1 - (WORLD.data('inipos').y - 10) / (wHeight - 20)) * pX + XMIN;
      _XMAX = (1 - (e.clientY - 10) / (wHeight - 20)) * pX + XMIN;
    } else if(WORLD.data('inipos').y < e.clientY) {
      _XMAX = (1 - (WORLD.data('inipos').y - 10) / (wHeight - 20)) * pX + XMIN;
      _XMIN = (1 - (e.clientY - 10) / (wHeight - 20)) * pX + XMIN;
    } else {
      CX.putImageData(WORLD.data('imgWOgui'), 0, 0);
      WORLD.data('dragging', false);
      WORLD.data('inipos', null);
      return;
    }
    
    ComputeDrawLogistic(_AMIN, _AMAX, _XMIN, _XMAX);
  }
  WORLD.data('dragging', false);
  WORLD.data('inipos', null);
}

function mousemove(e) {
  e.preventDefault();
  var corner = WORLD.data('inipos');
  if( corner !== null ) {
    WORLD.data('dragging', true);
    CX.putImageData(WORLD.data('imgWOgui'), 0, 0);
    CX.fillStyle = "rgba(204, 204, 255, 0.3)";
    CX.fillRect(corner.x, corner.y, e.clientX - corner.x, e.clientY - corner.y);
    CX.lineWidth = 2;
    CX.strokeStyle = "#CCF";
    CX.strokeRect(corner.x, corner.y, e.clientX - corner.x, e.clientY - corner.y);
  }
}

////////////////////////////////////////////////////////////////
// Entry point                                                //
////////////////////////////////////////////////////////////////
$(document).ready(function() {
  
  // Get the canvas
  WORLD = $('#world');
  
  // and the context
  CX = document.querySelector("#world").getContext("2d");
  document.querySelector("#world").width = WORLD.width();
  document.querySelector("#world").height = WORLD.height();
  
  // Initial state
  WORLD.data('dragging', false);
  WORLD.data('inipos', null);
  
  // Event handlers
  WORLD.on('mousedown', function(e) {
    e.preventDefault();
    WORLD.data('inipos', {x:e.clientX, y:e.clientY});
  });
  
  WORLD.on('mouseup', mouseup);
  
  WORLD.on('mousemove', mousemove);
  
  ComputeDrawLogistic(0, 4, 0, 1);
  
});

