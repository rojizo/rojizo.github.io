"use strict";

////////////////////////////////////////////////////////////////
// Global vars                                                //
////////////////////////////////////////////////////////////////
var RADIUS = .25;
var WORLD;
var CX;
var LISTG;

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
    var posa = (a - AMIN)/pA * wWidth;
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
          var posx = (1 - (y - XMIN)/pX) * wHeight;
          CX.fillRect(posa-RADIUS, posx-RADIUS, 2*RADIUS, 2*RADIUS);
        }
      
      if(mySet.size > 2000)
        break;
    }
    
    for(let y of finalSet) 
      if( (y <= XMAX) && (y >= XMIN) ){
        var posx = (1 - (y - XMIN)/pX) * wHeight;
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

  if($("#INV").is(":checked"))
    iDrawBifurcation(AMIN, AMAX, XMIN, XMAX);
  
  CX.fillStyle = color;
  
  var wWidth = WORLD.width();
  var wHeight = WORLD.height();
  
  var pA = (AMAX - AMIN);
  var pX = (XMAX - XMIN);
  
  var ASTEP = pA / wWidth / 2;
  
  for(var a=AMIN; a<=AMAX; a+=ASTEP) {
    var map = func(a);
    var x = Math.random() * pX + XMIN;
    var posa = (a - AMIN)/pA * wWidth;
    
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
        var posx = (1 - (x - XMIN)/pX) * wHeight;
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
  if(this !== e.target) return;
  if(WORLD.data('inipos') === null) return;
  
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
    
    // Transform position
    var tpos = {x:e.pageX - $(this).offset().left, 
                y:e.pageY - $(this).offset().top};
    
    if(WORLD.data('inipos').x > tpos.x) {
      _AMAX = WORLD.data('inipos').x * pA / wWidth + AMIN;
      _AMIN = tpos.x * pA / wWidth + AMIN;
    } else if(WORLD.data('inipos').x < e.clientX) {
      _AMAX = tpos.x * pA / wWidth + AMIN;
      _AMIN = WORLD.data('inipos').x * pA / wWidth + AMIN;
    } else {
      CX.putImageData(WORLD.data('imgWOgui'), 0, 0);
      WORLD.data('dragging', false);
      WORLD.data('inipos', null);
      return;
    }
    
    if(WORLD.data('inipos').y > e.clientY) {
      _XMIN = (1 - WORLD.data('inipos').y / wHeight) * pX + XMIN;
      _XMAX = (1 - tpos.y / wHeight) * pX + XMIN;
    } else if(WORLD.data('inipos').y < e.clientY) {
      _XMAX = (1 - WORLD.data('inipos').y / wHeight) * pX + XMIN;
      _XMIN = (1 - tpos.y / wHeight) * pX + XMIN;
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
    // Transform position
    var tpos = {x:e.pageX - $(this).offset().left, 
                y:e.pageY - $(this).offset().top};
    
    WORLD.data('dragging', true);
    
    CX.clearRect(0,0,WORLD.width(),WORLD.height());
    CX.putImageData(WORLD.data('imgWOgui'), 0, 0);
    CX.fillStyle = "rgba(204, 204, 255, 0.3)";
    CX.fillRect(corner.x, corner.y, tpos.x - corner.x, tpos.y - corner.y);
    CX.lineWidth = 2;
    CX.strokeStyle = "#CCF";
    CX.strokeRect(corner.x, corner.y, tpos.x - corner.x, tpos.y - corner.y);
  }
}

function mousedown(e) {
  if(WORLD.data('inipos') !== null) return; 
  if(this !== e.target) return;
  
  e.preventDefault();
  // Transform position
  var tpos = {x:e.pageX - $(this).offset().left, 
              y:e.pageY - $(this).offset().top};
  WORLD.data('inipos', tpos);
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
  
  // Sliders
  var funcEL = document.querySelector('#func');
  var func = function() {
    plot(funcEL, function(x) {return x;}, 
      {range: [-.05, 1.05, -.05, 1.05], strokeStyle: 'red', lineWidth: 1.5, steps: 1, axes:true},
      true
    );
    
    var f = function(x) {return $('#valA').slider('getValue')*x*(1-x);};
    //var xx = function(x) {return g(g(x));};
    plot(funcEL, f, 
      {range: [-.05, 1.05, -.05, 1.05], strokeStyle: 'blue', lineWidth: 3, steps: 500, xmin:0, xmax:1}
    );
    
    var XN = $('#valX0').slider('getValue');
    var XN1; 
    var list = [[XN,0]];
    for(var i=0; i<100; i++) {
      var XN1 = f(XN);
      list.push([XN,XN1]);
      list.push([XN1,XN1]);
      XN = XN1;
    }
    list_plot(funcEL, list, 
      {range: [-.05, 1.05, -.05, 1.05], strokeStyle: 'black', lineWidth: 1}
    );
  }
  $('#valA').slider().on('slide', func);
  $('#valX0').slider().on('slide', func);
  func();
  
  
  // Iterations
  // Sliders
  var funcEL2 = document.querySelector('#funcs');
  var funcs = function() {
    plot(funcEL2, function(x) {return x;}, 
      {range: [-.05, 1.05, -.05, 1.05], strokeStyle: 'red', lineWidth: 1.5, steps: 1, axes:true},
      true
    );
    
    var g = function(x) {return $('#valA2').slider('getValue')*x*(1-x);};
    var f = function(x) {
      var ret = x;
      var n = $('#valn').slider('getValue');
      for(var i=0; i<n; i++) {
        x = g(x);
      }
      return x;
    };
    plot(funcEL2, f, 
      {range: [-.05, 1.05, -.05, 1.05], strokeStyle: 'blue', lineWidth: 3, steps: 100, xmin:0, xmax:1}
    );
  }
  $('#valA2').slider().on('slide', funcs);
  $('#valn').slider().on('slide', funcs);
  funcs();
  
  
});


