function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype = {
  // !!reminder!! In 2d-canvas, x-axis to y-axis is CW 
  // return 1 if clock-wise
  //        0 if colinear
  //        -1 if counter-clock-wise
  orientation: function(p0, p1, p2) {
    let _x1 = p1.x - p0.x;
    let _y1 = p1.y - p0.y;
    let _x2 = p2.x - p0.x;
    let _y2 = p2.y - p0.y;
    return Math.sign(_x1 * _y2 - _x2 * _y1);
  }
};

function Segment(x0, y0, x1, y1, args = {}) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
Segment.prototype = {
  intersect: function(s0, s1) {}
};
