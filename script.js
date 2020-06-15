// canvas coordinate
// 0----+x>
// |     |
// |     |
// +y----
// V

const canvas = document.getElementById("canvas");
const fps = 30;
var player = { x: canvas.width / 2, y: canvas.height / 2 };
var userDrawingMode = true;
var mouseDownLast = {};
var mousePosition = {};
var isMouseDown = false;

var lastUpdate = +new Date();
var updateEvent = setInterval(function() {
  let interval = +new Date() - lastUpdate;
  for (let ticks = Math.floor((interval / 1000) * fps); ticks > 0; ticks--) {
    gameUpdate();
  }
  draw();
}, 1000 / fps);

// var updateObjects = [];
// var drawableObjects = [];

// function Gamebody(x = 0, y = 0) {
//   this.x = x;
//   this.y = y;
//   this.vx = 0;
//   this.vy = 0;
//   this.ax = 0;
//   this.ay = 0;
// }

// function Player(x = 0, y = 0, w = 30, h = 50) {
//   Gamebody.call(this, x, y);
//   this.w = w;
//   this.h = h;

//   //relative drawing origin
//   this.relx = -w / 2;
//   this.rely = -h;

//   this.update = function(ticks) {
//     this.x += ticks;
//   };

//   this.drawbody = [];
//   this.draw = function() {
//     let ctx = canvas.getContext("2d");
//     ctx.fillStyle = "rgba(0, 200, 0, 0.5)";
//     ctx.fillRect(this.x + this.relx, this.y + this.rely, this.w, this.h);
//   };
// }

// var player = new Player(50, 100, 30, 50);
// drawableObjects.push(player);
// updateObjects.push(player);

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

  if (isMouseDown) {
    let [x0, y0] = [mouseDownLast.x, mouseDownLast.y];
    let [x1, y1] = [mousePosition.x, mousePosition.y];
    new Box(x0, y0, x1, y1, {
      fillStyle: "transparent",
      strokeStyle: "#aaa"
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

function gameUpdate() {}

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
