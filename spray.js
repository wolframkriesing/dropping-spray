var defaultOptions = {
  color : 'rgb(0, 0, 255)',
  size : 5,

  splatterAmount : 10,
  splatterRadius : 20,

  dropper : true,
  dropThreshold : 50,
  dropAfter : 3
};

function Spray(options) {
  var opts = options || defaultOptions;
  var color = getOpt('color');
  var size = getOpt('size');
  var splatterAmount = getOpt('splatterAmount');
  var splatterRadius = getOpt('splatterRadius');
  var dropper = getOpt('dropper');
  var dropThreshold = getOpt('dropThreshold');
  var dropAfter = getOpt('dropAfter');
  var canvas = opts.canvas || document.getElementsById('spray1');
  var dropFns = [];
  var drops = [];
  var ctx = canvas.getContext('2d');

  initializeDropCounter();

  return {
    sprayAt : sprayAt,
    renderDrops : renderDrops
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
  }

  function initializeDropCounter() {
    for (var x = 0; x < canvas.width / size; x++) {
      drops[x] = [];
      for (var y = 0; y < canvas.height / size; y++) {
        drops[x][y] = {
          count : 0,
          drops : false,
          width : 0,
          dropAfter : dropAfter
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

      myDrop.count = myDrop.count - size;

      if (myDrop.count <= 0) {
        drops[x][y] = {
          count : 0,
          drops : false
        };
        dropFns.splice(idx, 1);
      } else if (y < maxY) {
        myDrop.dropAfter = Math.max(1, myDrop.dropAfter - 1);

        if (myDrop.dropAfter === 1) {
          deltaWidth = Math.floor(Math.random() * 3) - 1;
          deltaX = Math.floor(Math.random() * 3) - 1;

          // drop next step
          ctx.lineWidth = myDrop.width;
          ctx.moveTo(x * size, y * size);

          y = y + 1;
          otherDrop = drops[x][y];
          otherDrop.count += myDrop.count;
          otherDrop.drops = true;
          otherDrop.width = Math.max(Math.max(1, myDrop.width + deltaWidth), otherDrop.width);
          ctx.lineTo((x * size) + deltaX, y * size);

          myDrop.count = 0;
          myDrop.drops = false;
          myDrop = otherDrop;
        } else {
          myDrop.count = myDrop.count + size;
        }

        dropFns.splice(idx, 1, createDropFnFor(maxY, x, y, myDrop));
      }
    };
  }

  function sprayAt(x, y) {
    var xArea = Math.floor(x / size);
    var yArea = Math.floor(y / size);
    var drop = drops[xArea][yArea];
    if (dropper) {
      drop.count += size;
      if (drop.count > dropThreshold && !drop.drops) {
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
