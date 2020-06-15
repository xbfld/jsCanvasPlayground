// canvas coordinate
// 0----+x>
// |     |
// |     |
// +y----
// V

const canvas = document.getElementById("canvas");
const fps = 30;
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
player.body = new Box();
player.update = function() {
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
}

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
