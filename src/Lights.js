import Color from 'famous/utilities/Color';
import ColorRange from './utils/ColorRange';
import GeodesicSphere from 'famous/webgl-geometries/primitives/GeodesicSphere';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import PointLight from 'famous/webgl-renderables/lights/PointLight';

const DEBUG = true;
const GEOMETRY = new GeodesicSphere({detail: 1});
const LENGTH = 2 * Math.PI;
const RADIUS = 200;
const TOTAL = 4;

class LightSpinner {
  constructor(node) {
    this.node = node;
    this.id = this.node.addComponent(this);
    this.node.requestUpdate(this.id);
  }
  onUpdate(time) {
    this.node.setRotation(0, 0, time / 2000);
    this.node.requestUpdateOnNextTick(this.id);
  }
}

export default class Lights extends Node {
  constructor() {
    super();
    this
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5);
    let angle = LENGTH / TOTAL;
    let pos = [0, 0, RADIUS];
    let color;
    this.lights = [];
    for (var i = 0, counter = 0; i < LENGTH; i += angle, counter++) {
      pos[0] = RADIUS * Math.cos(i);
      pos[1] = RADIUS * Math.sin(i);
      this.lights[counter] = this.addChild(new Light())
        .setPosition(...pos);
    }
    this.spinner = new LightSpinner(this);
  }
}

class Light extends Node {
  constructor() {
    super();
    this
      .setAlign(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5);
    this.color = new Color(ColorRange.getRandomHex('pastel'));
    this.light = new PointLight(this);
    this.light.setColor(this.color);
    if (DEBUG) {
      this
        .setSizeMode('absolute', 'absolute', 'absolute')
        .setAbsoluteSize(50, 50, 50);
      this.mesh = new Mesh(this);
      this.mesh.setGeometry(GEOMETRY);
      this.mesh.setBaseColor(this.color);
    }
  }
}
