export default class DragRotation {
  constructor(node) {
    const radiansMultiplier = Math.PI / 180;
    this.node = node;
    // Convert from quaternion to radians
    let initial = this.node.getRotation();
    let x = initial[0];
    let y = initial[1];
    let z = initial[2];
    let w = initial[3];
    let xx = x * x;
    let yy = y * y;
    let zz = z * z;
    let ty = 2 * (x * z + y * w);

    let rx = Math.atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy));
    let ry = Math.asin(ty < -1 ? -1 : ty > 1 ? 1 : ty);
    let rz = Math.atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz));

    let prevX = 0;
    let prevY = 0;
    let prevZ = 0;

    let isRotating = false;

    let rotate = function(evt) {
      rx += (prevY - evt.clientY) * radiansMultiplier;
      rz += (prevX - evt.clientX) * radiansMultiplier;
      prevY = evt.clientY;
      prevX = evt.clientX;
      this.node.setRotation(rx, null, rz);
    }.bind(this);

    window.addEventListener('mousedown', (evt) => {
      isRotating = true;
      prevY = evt.clientY;
      prevX = evt.clientX;
    });
    window.addEventListener('mouseup', () => {
      isRotating = false;
      let initial = this.node.getRotation();
      let x = initial[0];
      let y = initial[1];
      let z = initial[2];
      let w = initial[3];
      let xx = x * x;
      let yy = y * y;
      let zz = z * z;
      let ty = 2 * (x * z + y * w);

      let rx = Math.atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy));
      let ry = Math.asin(ty < -1 ? -1 : ty > 1 ? 1 : ty);
      let rz = Math.atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz));
      console.log('setRotation(' + rx + ', ' + ry + ', ' + rz + ')');
    });
    window.addEventListener('mousemove', (evt) => {
      if (isRotating) {
        rotate(evt);
      }
    });
  }
}
