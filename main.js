var Spray = require('./spray.js');

var canvas = document.getElementById('spray1');
var s1 = new Spray({
  color : 'rgb(0, 255, 0)',
  size : 5,
  canvas : canvas
});
var spraying = false;
var mouseX = 0;
var mouseY = 0;

function render() {
  if (spraying) {
    s1.sprayAt(mouseX, mouseY);
  }
  requestAnimationFrame(render);
}
render();

canvas.addEventListener('mousedown', function (event) {
  event.preventDefault();
  event.stopPropagation();
  spraying = true;
  mouseX = event.clientX - canvas.offsetLeft;
  mouseY = event.clientY - canvas.offsetTop;
});

canvas.addEventListener('mousemove', function (event) {
  mouseX = event.clientX - canvas.offsetLeft;
  mouseY = event.clientY - canvas.offsetTop;
});

document.addEventListener('mouseup', function (event) {
  spraying = false;
});
