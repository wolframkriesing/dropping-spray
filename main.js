var Spray = require('./spray.js');

var canvas = document.getElementById('spray1');

canvas.height = document.getElementById('spray1').offsetHeight;
canvas.width = window.innerWidth - 30;

var form = document.getElementById('options');
var autoSpraySpeed = parseInt(form.autoSpraySpeed.value);

form.red.addEventListener('change', resetSpray);
form.green.addEventListener('change', resetSpray);
form.blue.addEventListener('change', resetSpray);
form.size.addEventListener('change', resetSpray);
form.splatterAmount.addEventListener('change', resetSpray);
form.splatterRadius.addEventListener('change', resetSpray);
form.drops.addEventListener('change', resetSpray);
form.dropThreshold.addEventListener('change', resetSpray);
form.dropSpeed.addEventListener('change', resetSpray);
form.autoSpraySpeed.addEventListener('change', function () {
  autoSpraySpeed = parseInt(form.autoSpraySpeed.value);
});

document.getElementById('randomColor').addEventListener('click', randomizeColor);
document.getElementById('autoSpray').addEventListener('click', function () {
  resetSpray();
  var x = 0;
  var y = Math.floor(Math.random() * canvas.height);

  sprayFromLeftToRight();

  function sprayFromLeftToRight() {
    x = x + Math.round(Math.random() * Math.max(0, autoSpraySpeed));
    y = Math.max(0, Math.min(canvas.height - 1, (y + Math.floor(Math.random() * 3) - 1)));
    if (x < canvas.width) {
      spray.sprayAt(x, y);
      requestAnimationFrame(sprayFromLeftToRight);
    } else {
      console.log('auto spray done');
    }
  }
});

function randomizeColor() {
  form.red.value = Math.round(Math.random() * 255);
  form.green.value = Math.round(Math.random() * 255);
  form.blue.value = Math.round(Math.random() * 255);
  resetSpray();
}

function resetSpray() {
  spray = createSpray();
}

function createSpray() {
  var r = parseInt(form.red.value);
  var g = parseInt(form.green.value);
  var b = parseInt(form.blue.value);
  var options = {
    color : 'rgb(' + r + ',' + g + ',' + b + ')',
    canvas : canvas,
    size : parseInt(form.size.value),
    splatterAmount : parseInt(form.splatterAmount.value),
    splatterRadius : parseInt(form.splatterRadius.value),
    dropper : !!form.drops.checked,
    dropThreshold : parseInt(form.dropThreshold.value),
    dropSpeed : parseInt(form.dropSpeed.value)
  };

  console.log(options);
  return new Spray(options);
}
var spray = createSpray();

var spraying = false;

var mouseX = 0;
var mouseY = 0;
var requestsAnimFrame = false;

function render() {
  if (spraying) {
    spray.sprayAt(mouseX, mouseY);
  }
  requestsAnimFrame = spray.renderDrops() || spraying;

  if (requestsAnimFrame) {
    requestAnimationFrame(render);
  }
}
render();

var startEventCanvas = downEvent(canvas, function () {
  spraying = true;
  requestsAnimFrame = true;
  render();
});
var moveEventCanvas = downEvent(canvas);

canvas.addEventListener('mousedown', startEventCanvas);
canvas.addEventListener('mousemove', moveEventCanvas);
canvas.addEventListener('touchstart', startEventCanvas);
canvas.addEventListener('touchmove', moveEventCanvas);

document.addEventListener('mouseup', stopSpraying);
document.addEventListener('touchend', stopSpraying);

function downEvent(canvas, cb) {
  return function (event) {
    event.preventDefault();
    event.stopPropagation();
    var touchList = event.touches;
    if (touchList) {
      var touch = touchList[0];
      mouseX = parseInt(touch.clientX) - canvas.offsetLeft;
      mouseY = parseInt(touch.clientY) - canvas.offsetTop;
    } else {
      mouseX = event.clientX - canvas.offsetLeft;
      mouseY = event.clientY - canvas.offsetTop;
    }
    if (cb) {
      cb();
    }
  };
}

function stopSpraying() {
  spraying = false;
  spray.resetDrops();
}
