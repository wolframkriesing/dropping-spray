var Spray = require('./spray.js');

var canvas1 = document.getElementById('spray1');
var canvas2 = document.getElementById('spray2');

var s1 = new Spray({
  color : 'rgb(255, 255, 0)',
  size : 5,
  canvas : canvas1,
  dropper: false
});
var s2 = new Spray({
  color : 'rgb(0, 0, 255)',
  size : 5,
  canvas : canvas2
});

var spraying1 = false;
var spraying2 = false;

var mouseX = 0;
var mouseY = 0;

function render() {
  if (spraying1) {
    s1.sprayAt(mouseX, mouseY);
  }
  s1.renderDrops();
  if (spraying2) {
    s2.sprayAt(mouseX, mouseY);
  }
  s2.renderDrops();

  requestAnimationFrame(render);
}
render();

canvas1.addEventListener('mousedown', function (event) {
  event.preventDefault();
  event.stopPropagation();
  spraying1 = true;
  mouseX = event.clientX - canvas1.offsetLeft;
  mouseY = event.clientY - canvas1.offsetTop;
});

canvas1.addEventListener('mousemove', function (event) {
  mouseX = event.clientX - canvas1.offsetLeft;
  mouseY = event.clientY - canvas1.offsetTop;
});

canvas2.addEventListener('mousedown', function (event) {
  event.preventDefault();
  event.stopPropagation();
  spraying2 = true;
  mouseX = event.clientX - canvas2.offsetLeft;
  mouseY = event.clientY - canvas2.offsetTop;
});

canvas2.addEventListener('mousemove', function (event) {
  mouseX = event.clientX - canvas2.offsetLeft;
  mouseY = event.clientY - canvas2.offsetTop;
});

document.addEventListener('mouseup', function (event) {
  spraying1 = false;
  spraying2 = false;
});
