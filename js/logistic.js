"use strict";

////////////////////////////////////////////////////////////////
// Global vars                                                //
////////////////////////////////////////////////////////////////
var RADIUS = .25;
var WORLD;
var CX;

////////////////////////////////////////////////////////////////
// Logistic map                                               //
////////////////////////////////////////////////////////////////
function logisticMap(a) {
  return function(x) { return a * x * (1 - x); };
}

function ilogMap(a) {
  return function(y) { 
    var dis = 1 - 4 * y / a;
    if(dis < 0) return null;
    dis = Math.sqrt(dis);
    return [(1 - dis) / 2, (1 + dis) / 2]; 
  };
}

////////////////////////////////////////////////////////////////
// Draw a set of two function                                 //
////////////////////////////////////////////////////////////////
function iDrawBifurcation(AMIN, AMAX, XMIN, XMAX, func, color) {
  
  if (typeof func === 'undefined') func = ilogMap;
  if (typeof color === 'undefined') color = "#F00";
  
  CX.clearRect(0,0,WORLD.width(),WORLD.height());
  
  CX.fillStyle = color;
  
  var wWidth = WORLD.width();
  var wHeight = WORLD.height();
  
  var pA = (AMAX - AMIN);
  var pX = (XMAX - XMIN);
  
  var ASTEP = pA / wWidth / 2;
  
  for(var a=AMIN; a<=AMAX; a+=ASTEP) {
    var map = func(a);
    var finalSet = new Set();
    var mySet = new Set();
    var posa = (a - AMIN)/pA * (wWidth - 20) + 10;
//    console.log(posa);
    mySet.add(Math.random() * pX + XMIN);
    
    // Transient
    for(var i=0; i<100; i++) {
      var tmpSet = new Set();
      for(let y of mySet) {
        var fy = map(y);
        if(fy == null) {
          finalSet.add(y);
        } else {
          tmpSet.add(fy[0]);
          tmpSet.add(fy[1]);
        }
      }
      mySet = tmpSet;
      if(mySet.size > 2000)
        break;
    }
    
    // Draw!
    for(var i=0; i<100; i++) {
      var tmpSet = new Set();
      for(let y of mySet) {
        var fy = map(y);
        if(fy == null)
          finalSet.add(y);
        else {
          tmpSet.add(fy[0]);
          tmpSet.add(fy[1]);
        }
      }
      mySet = tmpSet;
      
      for(let y of mySet) 
        if( (y <= XMAX) && (y >= XMIN) ){
          var posx = (1 - (y - XMIN)/pX) * (wHeight - 20) + 10;
          CX.fillRect(posa-RADIUS, posx-RADIUS, 2*RADIUS, 2*RADIUS);
        }
      
      if(mySet.size > 2000)
        break;
    }
    
    for(let y of finalSet) 
      if( (y <= XMAX) && (y >= XMIN) ){
        var posx = (1 - (y - XMIN)/pX) * (wHeight - 20) + 10;
        CX.fillRect(posa-RADIUS, posx-RADIUS, 2*RADIUS, 2*RADIUS);
      }
    
  }
}



////////////////////////////////////////////////////////////////
// Draw function for range                                    //
////////////////////////////////////////////////////////////////
function DrawBifurcationAndUpdate(AMIN, AMAX, XMIN, XMAX, func, color) {
  
  DrawBifurcation(AMIN, AMAX, XMIN, XMAX, func, color);
  
  if(typeof(WORLD.data('AMAX')) !== 'undefined'){
    WORLD.data('pile').push({
      'AMAX': WORLD.data('AMAX'), 'AMIN': WORLD.data('AMIN'),
      'XMAX': WORLD.data('XMAX'), 'XMIN': WORLD.data('XMIN'),
      'TRANSIENT': WORLD.data('TRANSIENT'),
      'ITER': WORLD.data('ITER')
    });
  }
  
  WORLD.data({ 
    'imgWOgui': CX.getImageData(0, 0, WORLD.width(), WORLD.height()),
    'AMAX': AMAX, 'AMIN': AMIN,
    'XMAX': XMAX, 'XMIN': XMIN,
    'TRANSIENT': $('#TRANSIENT').val(), 'ITER': $('#ITER').val()
  });
  
  $('#range').html('a ∈ [' + AMIN + ', ' + AMAX + '] &nbsp;&nbsp;&nbsp;' + 
                   'x ∈ [' + XMIN + ', ' + XMAX + ']');
  
}

function DrawBifurcation(AMIN, AMAX, XMIN, XMAX, func, color) {
  
  if (typeof func === 'undefined') func = logisticMap;
  if (typeof color === 'undefined') color = "#000";
  
  document.querySelector("#world").width = WORLD.width();
  document.querySelector("#world").height = WORLD.height();

  //iDrawBifurcation(AMIN, AMAX, XMIN, XMAX);

  
  CX.fillStyle = color;
  
  var wWidth = WORLD.width();
  var wHeight = WORLD.height();
  
  var pA = (AMAX - AMIN);
  var pX = (XMAX - XMIN);
  
  var ASTEP = pA / wWidth / 2;
  
  for(var a=AMIN; a<=AMAX; a+=ASTEP) {
    var map = func(a);
    var x = Math.random() * pX + XMIN;
    var posa = (a - AMIN)/pA * (wWidth - 20) + 10;
    
    // Transient
    for(var i=$('#TRANSIENT').val(); i>0; i--) {
      var newx = map(x);
      if(newx == x) break;
      x = newx;
    }
    
    // Draw!
    for(var i=$('#ITER').val(); i>0; i--) {
      x = map(x);
      if( (x <= XMAX) && (x >= XMIN) ){
        var posx = (1 - (x - XMIN)/pX) * (wHeight - 20) + 10;
        CX.fillRect(posa-RADIUS, posx-RADIUS, 2*RADIUS, 2*RADIUS);
      }
    }
  }
  
  WORLD.data('imgWOgui', CX.getImageData(0, 0, WORLD.width(), WORLD.height()));
  
  // if(typeof(WORLD.data('AMAX')) !== 'undefined'){
  //   WORLD.data('pile').push({
  //     'AMAX': WORLD.data('AMAX'), 'AMIN': WORLD.data('AMIN'),
  //     'XMAX': WORLD.data('XMAX'), 'XMIN': WORLD.data('XMIN'),
  //     'TRANSIENT': WORLD.data('TRANSIENT'),
  //     'ITER': WORLD.data('ITER')
  //   });
  // }
  //
  // WORLD.data({
  //   'imgWOgui': CX.getImageData(0, 0, wWidth, wHeight),
  //   'AMAX': AMAX, 'AMIN': AMIN,
  //   'XMAX': XMAX, 'XMIN': XMIN,
  //   'TRANSIENT': $('#TRANSIENT').val(), 'ITER': $('#ITER').val()
  // });
  //
  // $('#range').html('a ∈ [' + AMIN + ', ' + AMAX + '] &nbsp;&nbsp;&nbsp;' +
  //                  'x ∈ [' + XMIN + ', ' + XMAX + ']');
}

////////////////////////////////////////////////////////////////
// Events Handlers                                            //
////////////////////////////////////////////////////////////////
function mouseup(e) {
  if(this !== e.target) 
    return
  
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
    
    DrawBifurcationAndUpdate(_AMIN, _AMAX, _XMIN, _XMAX);
  }
  WORLD.data('dragging', false);
  WORLD.data('inipos', null);
}

function mousemove(e) {
  if(this !== e.target) 
    return;
  
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

function mousedown(e) {
  if(this !== e.target) 
    return;
  e.preventDefault();
  WORLD.data('inipos', {x:e.clientX, y:e.clientY});
}

function dblclick(e){
  if(this !== e.target) 
    return;
  
  e.preventDefault();
  if(WORLD.data('pile').length != 0) {
    var params = WORLD.data('pile').pop();
    
    WORLD.removeData('imgWOgui').removeData('AMAX')
      .removeData('AMIN').removeData('XMAX').removeData('XMIN');
    
    $('#TRANSIENT').val(params.TRANSIENT);
    $('#ITER').val(params.ITER);
    DrawBifurcationAndUpdate(params.AMIN, params.AMAX, params.XMIN, params.XMAX);
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
  
  // Initial state
  WORLD.data('dragging', false);
  WORLD.data('inipos', null);
  WORLD.data('pile', []);
  
  // Event handlers
  WORLD.on('mousedown', mousedown).on('mouseup', mouseup)
    .on('mousemove', mousemove).on('dblclick', dblclick);
  $('#tools_container').on('mouseup', mouseup).on('mousemove', mousemove)
    .on('mousedown', mousedown).on('dblclick', dblclick);
  
  $('#compu').on('click',function(e){
    DrawBifurcation(WORLD.data('AMIN'), WORLD.data('AMAX'),
        WORLD.data('XMIN'), WORLD.data('XMAX'));
  });
  
  // First draw
  DrawBifurcationAndUpdate(0, 4, 0, 1);
  
  
  
  //Resize event
  var timer;
  $(window).on('resize', function(e){
    clearTimeout(timer);
    timer = setTimeout(function(){
      DrawBifurcation(WORLD.data('AMIN'), WORLD.data('AMAX'),
        WORLD.data('XMIN'), WORLD.data('XMAX'))
    }, 500);
  });
});


