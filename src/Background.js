import Color from 'famous/utilities/Color';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';

export default class Background extends Node {
  constructor() {
    super();
    this
      .setPosition(null, null, -1000)
      .setAlign(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setProportionalSize(2, 2);
    this.color = new Color('#000000');
    this.mesh = new Mesh(this);
    this.mesh.setGeometry('Plane');
    this.mesh.setBaseColor(this.color);
  }
}
