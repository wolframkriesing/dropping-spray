(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./spray.js":2}],2:[function(require,module,exports){
var defaultOptions = {
  color : 'rgb(0, 0, 255)',
  size : 5,

  splatterAmount : 10,
  splatterRadius : 20,

  dropper : true,
  dropThreshold : 50,
  dropSpeed : 3
};

function Spray(options) {
  var opts = options || defaultOptions;
  var color = getOpt('color');
  var size = getOpt('size');
  var splatterAmount = getOpt('splatterAmount');
  var splatterRadius = getOpt('splatterRadius');
  var dropper = getOpt('dropper');
  var dropThreshold = getOpt('dropThreshold');
  var dropSpeed = getOpt('dropSpeed');
  var canvas = opts.canvas;
  var dropFns = [];
  var drops = [];
  var ctx = canvas.getContext('2d');

  initializeDropCounter();

  return {
    sprayAt : sprayAt,
    renderDrops : renderDrops,
    resetDrops : initializeDropCounter
  };

  function getOpt(name) {
    var opt = opts[name];
    if (typeof opt !== 'undefined') {
      return opt;
    } else {
      return defaultOptions[name];
    }
  }

  function renderDrops() {
    if (dropper) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineCap = 'round';
      var amount = dropFns.length - 1;
      for (var i = amount; i >= 0; i--) {
        if (dropFns[i]) {
          dropFns[i](i);
        }
      }
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
    if (amount > 0) {
      return true;
    } else {
      return false;
    }
  }

  function initializeDropCounter() {
    for (var x = 0; x < canvas.width / size; x++) {
      drops[x] = [];
      for (var y = 0; y < canvas.height / size; y++) {
        drops[x][y] = {
          count : 0,
          drops : false,
          width : 0,
          dropSpeed : dropSpeed
        };
      }
    }
  }

  function filledCircle(x, y, radius) {
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  }

  function dropAt(x, y, initialDrop) {
    var maxY = drops[x].length - 1;
    var myDrop = initialDrop;

    dropFns.push(createDropFnFor(maxY, x, y, myDrop));
  }

  function createDropFnFor(maxY, x, y, myDrop) {
    return function (idx) {
      var deltaWidth, deltaX, otherDrop;

      if (myDrop.count <= 0) {
        myDrop.count = 0;
        dropFns.splice(idx, 1);
      } else if (y < maxY) {
        myDrop.dropSpeed = Math.max(1, myDrop.dropSpeed - myDrop.width);

        if (myDrop.dropSpeed === 1) {
          deltaWidth = Math.floor(Math.random() * 3) - 1;
          deltaX = Math.floor(Math.random() * 3) - 1;

          // drop next step
          ctx.lineWidth = myDrop.width;
          ctx.moveTo(x * size, y * size);

          y = y + 1;
          otherDrop = drops[x][y];
          if (!otherDrop.drops) {
            otherDrop.drops = true;
            myDrop.count = myDrop.count - myDrop.width;
          }
          otherDrop.count += myDrop.count;
          otherDrop.width = Math.max(Math.max(1, myDrop.width + deltaWidth), otherDrop.width);
          ctx.lineTo((x * size) + deltaX, y * size);

          myDrop.count = 0;
          myDrop = otherDrop;
        } else {
          myDrop.count = myDrop.count + size;
        }

        dropFns.splice(idx, 1, createDropFnFor(maxY, x, y, myDrop));
      }
    };
  }

  function sprayAt(x, y) {
    var xArea = Math.max(0, Math.floor(x / size));
    var yArea = Math.max(0, Math.floor(y / size));
    var drop = drops[xArea][yArea];
    if (dropper) {
      drop.count += size;
      if (drop.count > dropThreshold) {
        drop.drops = true;
        drop.width = size;
        dropAt(xArea, yArea, drop);
      }
    }
    ctx.save();
    ctx.fillStyle = color;
    filledCircle(x, y, size);
    drawCirclesAround(x, y);
    ctx.restore();
  }

  function drawCirclesAround(x, y) {
    var dx, dy, r, s, t;
    for (var i = splatterAmount; i > 0; i--) {
      ctx.beginPath();
      t = Math.random() * 2 * Math.PI;
      r = Math.random();
      dx = r * Math.cos(t) * splatterRadius;
      dy = r * Math.sin(t) * splatterRadius;
      s = 1 - (Math.sqrt(dx * dx + dy * dy) / splatterRadius);
      filledCircle(x + dx, y + dy, size * s);
      ctx.fill();
    }
  }
}


module.exports = Spray;

},{}]},{},[1]);
