
function plot(canvas, f, format, clean) {
  var ctx = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;
  var jqcanvas = $(canvas);
  
  if(typeof clean !== "undefined") {
    if(clean) {
      ctx.clearRect(0,0,width,height);
      jqcanvas.data('PLOTS_DATA', {'fn': [], 'format': []});
    }
  }
  
  var PLOT_DATA;
  if(typeof jqcanvas.data('PLOT_DATA') === 'undefined') {
    PLOT_DATA = {'fn': [], 'format': []};
  } else {
    PLOT_DATA = jqcanvas.data('PLOT_DATA');
  }
  
  PLOT_DATA.fn.push(f);
  PLOT_DATA.format.push(format);
  
  var widthScale = (width / (format.range[1] - format.range[0]));
  var heightScale = (height / (format.range[3] - format.range[2]));
  var xmin = ("xmin" in format)?format.xmin:format.range[0];
  var xmax = ("xmax" in format)?format.xmax:format.range[1];
  var step = (xmax-xmin) / (("steps" in format)?format.steps:50);
  
  if("axes" in format) {
    ctx.beginPath();
    ctx.moveTo(0,height + format.range[2] * heightScale);
    ctx.lineTo(width,height + format.range[2] * heightScale);

    ctx.moveTo(-format.range[0] * widthScale, 0);
    ctx.lineTo(-format.range[0] * widthScale, height);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  ctx.beginPath();
  var first = true;
  for(var x = xmin; x < xmax; x+=step) {
    var yGVal = height - (f(x) - format.range[2]) * heightScale;
    var xGVal = (x - format.range[0]) * widthScale;
    
    if(first) {
      ctx.moveTo(xGVal, yGVal);
      first = false;
    } else {
        ctx.lineTo(xGVal, yGVal);
    }
  }
  var yGVal = height - (f(xmax) - format.range[2]) * heightScale;
  var xGVal = (xmax - format.range[0]) * widthScale;
  ctx.lineTo(xGVal, yGVal);
  
  
  ctx.strokeStyle = format.strokeStyle;
  ctx.lineWidth = format.lineWidth;
  ctx.stroke();
  
  jqcanvas.data('PLOT_DATA', PLOT_DATA);
};