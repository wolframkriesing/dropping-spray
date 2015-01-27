var Spray = require('./spray.js');

var canvas1 = document.getElementById('spray1');

canvas1.height = document.getElementById('spray1').offsetHeight;
canvas1.width = (window.innerWidth / 2) - 60;

var s1 = new Spray({
  color : 'rgb(0, 0, 255)',
  size : 5,
  canvas : canvas1,
  dropper : true
});

var spraying1 = false;

var mouseX = 0;
var mouseY = 0;

function render() {
  if (spraying1) {
    s1.sprayAt(mouseX, mouseY);
  }
  s1.renderDrops();

  requestAnimationFrame(render);
}
render();

var startEventCanvas1 = downEvent(canvas1, function () {
  spraying1 = true;
});
var moveEventCanvas1 = downEvent(canvas1);

canvas1.addEventListener('mousedown', startEventCanvas1);
canvas1.addEventListener('mousemove', moveEventCanvas1);
canvas1.addEventListener('touchstart', startEventCanvas1);
canvas1.addEventListener('touchmove', moveEventCanvas1);

document.addEventListener('mouseup', stopSpraying);
document.addEventListener('touchend', stopSpraying);

function downEvent(canvas, cb) {
  return function (event) {
    event.preventDefault();
    event.stopPropagation();
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;
    if (cb) {
      cb();
    }
  };
}

function stopSpraying() {
  spraying1 = false;
  s1.resetDrops();
}
