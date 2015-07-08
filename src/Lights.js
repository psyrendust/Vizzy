import Color from 'famous/utilities/Color';
import ColorRange from './utils/ColorRange';
import GeodesicSphere from 'famous/webgl-geometries/primitives/GeodesicSphere';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import PointLight from 'famous/webgl-renderables/lights/PointLight';

import {SpinnerY, SpinnerZ} from './components/Spinner';

const DEBUG = true;
const GEOMETRY = new GeodesicSphere({detail: 1});
const LENGTH = 2 * Math.PI;
const POSITION_Z = [-400, 0, 400];
const RADIUS = 500;
const TOTAL = 3;
const COLOR_TYPES = ['', 'pastel', 'medium', 'dark'];

function getRandomColorType() {
  return COLOR_TYPES[Math.floor(Math.random() * 4)];
}

export default class Lights extends Node {
  constructor() {
    super();
    this
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5);
    this.setPosition(0, -100, 400);
    this.color = new Color('#ffffff');
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

// export default class Lights extends Node {
//   constructor() {
//     super();
//     this
//       .setAlign(0.5, 0.5, 0.5)
//       .setOrigin(0.5, 0.5, 0.5)
//       .setMountPoint(0.5, 0.5, 0.5);
//     let angle = LENGTH / TOTAL;
//     let pos = [0, 0, POSITION_Z];
//     let color;
//     this.lights = [];
//     for (var i = 0, counter = 0; i < LENGTH; i += angle, counter++) {
//       pos[0] = RADIUS * Math.cos(i);
//       pos[1] = RADIUS * Math.sin(i);
//       pos[2] = POSITION_Z[i];
//       this.lights[counter] = this.addChild(new Light())
//         .setPosition(...pos);
//     }
//     this.spinnerZ = new SpinnerZ(this, { speed: 6000 });
//     this.spinnerY = new SpinnerY(this, { speed: 6000 });
//   }
// }

class Light extends Node {
  constructor() {
    super();
    this
      .setAlign(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5);
    // this.color = new Color(ColorRange.getRandomHex('dark'));
    this.color = new Color('#ffffff');
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
  changeColor() {
    this.color.set(ColorRange.getRandomHex(getRandomColorType()), { duration: 100 }, ()=> {
      setTimeout(() => {
        this.changeColor();
      }, (Math.random() * 8000) + 2000);
    });
  }
}
