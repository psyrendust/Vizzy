import Color from 'famous/utilities/Color';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import Sphere from 'famous/webgl-geometries/primitives/Sphere';
import {SpinnerY} from './components/Spinner';

const PRIMITIVE_TYPES = [
  'POINTS',
  'LINES',
  'LINE_STRIP',
  'LINE_LOOP',
  'TRIANGLES',
  'TRIANGLE_STRIP',
  'TRIANGLE_FAN'
];
const SPHERE = new Sphere({
  detail: 4
});
SPHERE.spec.type = PRIMITIVE_TYPES[0];

export default class CenterPiece extends Node {
  constructor() {
    super();
    this
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(250, 250, 250)
      .setAlign(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setPosition(0, 0, 250);

    this.color = new Color('#ffffff');
    this.mesh = new Mesh(this);
    this.mesh.setGeometry(SPHERE);
    this.mesh.setBaseColor(this.color);
    this.spinner = new SpinnerY(this, {speed: 3000});
  }
}
