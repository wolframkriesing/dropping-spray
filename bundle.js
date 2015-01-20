(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./spray.js":2}],2:[function(require,module,exports){
var defaultOptions = {
  color : 'rgb(0, 0, 255)',
  size : 15,
  dropper : true,
  max : 20
};

function Spray(options) {
  var opts = options || defaultOptions;
  var color = opts.color || defaultOptions.color;
  var size = opts.size || defaultOptions.size;
  var max = opts.max || defaultOptions.max;
  var dropper = opts.max || defaultOptions.dropper;
  var canvas = opts.canvas || document.getElementsById('spray1');
  var drops = [];
  var ctx = canvas.getContext('2d');
  initializeDropCounter();

  return {
    sprayAt : sprayAt
  };

  function initializeDropCounter() {
    for (var x = 0; x < canvas.width / size; x++) {
      drops[x] = [];
      for (var y = 0; y < canvas.height / size; y++) {
        drops[x][y] = {
          count : 0,
          drops : false,
          y : 0
        };
      }
    }
  }

  function filledCircle(x, y, radius) {
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  }

  function dropAt(x, y) {
    var maxY = drops[x].length - 1;

    dropFn();

    function dropFn() {
      var otherDrop;
      var myDrop = drops[x][y];

      myDrop.count = myDrop.count - 1;

      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color;
      filledCircle(x * size, y * size, Math.random() * size);
      ctx.fill();
      ctx.restore();

      if (myDrop.count <= 0) {
        drops[x][y] = {
          count : 0,
          drops : false
        };
      } else if (y < maxY) {
        myDrop.y = myDrop.y + 1;
        if (myDrop.y > size) {
          y = y + 1;
          otherDrop = drops[x][y];
          otherDrop.count += myDrop.count;
          otherDrop.drops = true;
          myDrop.y = 0;
          myDrop.count = 0;
          myDrop.drops = false;
        }
        requestAnimationFrame(dropFn);
      }
    }
  }

  function sprayAt(x, y) {
    var xArea = Math.floor(x / size);
    var yArea = Math.floor(y / size);
    if (dropper) {
      drops[xArea][yArea].count += 1;
      if (drops[xArea][yArea].count > 50 && !drops[xArea][yArea].drops) {
        console.log('start drop at ' + (xArea * size) + ',' + (yArea * size));
        drops[xArea][yArea].drops = true;
        dropAt(xArea, yArea);
      } else {
        console.log('dropArea[' + xArea + '][' + yArea + '] = ' + JSON.stringify(drops[xArea][yArea]));
      }
    }
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    var skew = Math.random() * max;
    var s = size * (skew / max);
    filledCircle(x, y, s);
    ctx.fill();
    ctx.restore();
  }
}


module.exports = Spray;

},{}]},{},[1]);
