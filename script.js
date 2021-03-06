// canvas coordinate
// 0----+x>
// |     |
// |     |
// +y----
// V

const canvas = document.getElementById("canvas");
const fps = 60;
var userDrawingMode = true;
var mouseDownLast = {};
var mousePosition = {};
var isMouseDown = false;

const nowTick = function() {
  return (+new Date() * fps) / 1000;
};
var lastTick = nowTick();
var updateEvent = setInterval(function() {
  for (let now = nowTick(); lastTick < now; lastTick++) {
    gameUpdate();
  }
  draw();
}, 1000 / fps);

function draw() {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(104, 153, 185)"; // Pythagorean triple
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function drawCrosshair(x, y, ghost) {
    ctx.strokeStyle = ghost
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(0, 255, 0, 0.8)";
    ctx.beginPath();
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x, y + 15);
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x, y - 15);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 15, y);
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x - 15, y);
    ctx.stroke();
  }

  boxs.forEach(b => {
    b.draw();
  });

  player.draw();

  if (isMouseDown) {
    let [x0, y0] = [mouseDownLast.x, mouseDownLast.y];
    let [x1, y1] = [mousePosition.x, mousePosition.y];
    new Box(x0, y0, x1, y1, {
      fillStyle: "transparent",
      strokeStyle: "#ccc",
      setLineDash: [9, 3, 3, 3, 3, 3]
    }).draw();
    drawCrosshair(x0, y0, true);
    drawCrosshair(x1, y1, false);
  }
}

var boxs = [];
function Box(x0, y0, x1, y1, args = {}) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.fillStyle = args.fillStyle || "magenta";
  this.strokeStyle = args.strokeStyle || "transparent";
  this.setLineDash = args.setLineDash || [];
  this.draw = function() {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = this.fillStyle;
    let [x0, y1, w, h] = [
      this.x0,
      this.y0,
      this.x1 - this.x0,
      this.y1 - this.y0
    ];
    ctx.fillRect(x0, y1, w, h);
    ctx.save();
    ctx.setLineDash(this.setLineDash);
    ctx.strokeStyle = this.strokeStyle;
    ctx.strokeRect(x0, y1, w, h);
    ctx.restore();
  };
}

var player = { x: canvas.width / 2, y: canvas.height / 2, w: 30, h: 60 };
player = Object.assign({}, player, { vx: 0, vy: 0, ax: 0, ay: 0 });
player.body = new Box();
player.update = function() {
  let { x: x, y: y, vx: vx, vy: vy, ax: ax, ay: ay } = player;

  let axt = ax / fps;
  let _x = x + (vx + 0.5 * axt) / fps;
  let _vx = vx + axt;

  let ayt = ay / fps;
  let _y = y + (vy + 0.5 * ayt) / fps;
  let _vy = vy + ayt;

  boxs.forEach(box => {
    if (
      Math.sign(box.y0 - _y) + Math.sign(box.y1 - _y) === 0 &&
      Math.sign(box.x0 - _x) + Math.sign(box.x1 - _x) === 0
    ) {
      _y = Math.min(box.y0, box.y1);
    }
  });
  if (_y > canvas.height) {
    _y = canvas.height;
  }

  player.x = _x;
  player.y = _y;
  player.vx = _vx;
  player.vy = _vy;

  player.body.x0 = player.x - player.w / 2;
  player.body.x1 = player.x + player.w / 2;
  player.body.y0 = player.y - player.h;
  player.body.y1 = player.y;
};
player.draw = function() {
  player.body.draw();
};

function gameUpdate() {
  player.update();

  let infotext = "Info text is not setted on script.js";
  infotext = "Pressed keys:\n";
  for (let [k, v] of Object.entries(keyDownLast)) {
    infotext += "" + k + ": " + v.timeStamp + "\n";
  }

  document.getElementById("info").innerText = infotext;
}

// EventListener
canvas.addEventListener("mousedown", e => {
  isMouseDown = true;
  mouseDownLast.x = e.layerX;
  mouseDownLast.y = e.layerY;
  console.log("mousedown", mouseDownLast);
});
canvas.addEventListener("mouseup", e => {
  isMouseDown = false;
  let [x1, y1] = [e.layerX, e.layerY];
  let [x0, y0] = [mouseDownLast.x, mouseDownLast.y];
  if (userDrawingMode) {
    let f = Math.random() * 360;
    let s = (f + 180) % 360;
    boxs.push(
      new Box(x0, y0, x1, y1, {
        fillStyle: "hsl(" + f + ", 100%, 50%)",
        strokeStyle: "hsl(" + s + ", 100%, 50%)"
      })
    );
  }
  console.log("mouseup", e.layerX, e.layerY);
});

canvas.addEventListener("mousemove", e => {
  mousePosition.x = e.layerX;
  mousePosition.y = e.layerY;
});

var keyDownLast = {};
var keyUpLast = {};
function isKeyHolding(keycode) {
  let c = keycode;
  let kdl = keyDownLast;
  let kul = keyUpLast;

  return kdl[c] && (!kul[c] || kul[c].timeStamp < kdl[c].timeStamp);
}

var ctr, controller;
ctr = controller = { vx1: 0, vx2: 0, vy1: 0, vy2: 0, speed: 100 };
ctr.startRight = function() {
  ctr.vx1 = +ctr.speed;
  ctr.final();
};
ctr.startLeft = function() {
  ctr.vx2 = -ctr.speed;
  ctr.final();
};
ctr.startUp = function() {
  ctr.vy1 = -ctr.speed;
  ctr.final();
};
ctr.startDown = function() {
  ctr.vy2 = +ctr.speed;
  ctr.final();
};
ctr.stopRight = function(){
  ctr.vx1=0
  ctr.final();
}
ctr.stopLeft = function(){
  ctr.vx2=0
  ctr.final();
}
ctr.stopUp = function() {
  ctr.vy1 = 0
  ctr.final();
};
ctr.stopDown = function() {
  ctr.vy2 = 0
  ctr.final();
};
ctr.final = function() {
  player.vx = ctr.vx1 + ctr.vx2;
  player.vy = ctr.vy1 + ctr.vy2;
};

document.addEventListener("keydown", e => {
  // ignore repeated event (ex. holding key)
  if (isKeyHolding(e.code)) {
    return;
  }
  console.log("wow");
  keyDownLast[e.code] = e;
  switch (e.code) {
    case "KeyD":
    case "ArrowRight":
      ctr.startRight()
      break;
    case "KeyA":
    case "ArrowLeft":
      ctr.startLeft()
      break;
    case "KeyW":
    case "ArrowUp":
      ctr.startUp()
      break;
    case "KeyS":
    case "ArrowDown":
      ctr.startDown()
      break;
  }
});

document.addEventListener("keyup", e => {
  // let t0 = keyDownLast[e.code].timeStamp;
  // let t1 = e.timeStamp;
  // let dt = t1 - t0;
  // console.log(e.code, dt);

  keyUpLast[e.code] = e;
  switch (e.code) {
    case "KeyD":
    case "ArrowRight":
      ctr.stopRight()
      break;
    case "KeyA":
    case "ArrowLeft":
      ctr.stopLeft()
      break;
    case "KeyW":
    case "ArrowUp":
      ctr.stopUp()
      break;
    case "KeyS":
    case "ArrowDown":
      ctr.stopDown()
      break;
  }
});
