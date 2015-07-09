import Color from 'famous/utilities/Color';
import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import GeometryHelper from 'famous/webgl-geometries/GeometryHelper';
import Material from 'famous/webgl-materials/Material';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import Box from 'famous/webgl-geometries/primitives/Box';
import Vec3 from 'famous/math/Vec3';

import ColorRange from './utils/ColorRange';
import DragRotation from './components/DragRotation';

const PRIMITIVE_TYPES = [
  'POINTS',
  'LINES',
  'LINE_STRIP',
  'LINE_LOOP',
  'TRIANGLES',
  'TRIANGLE_STRIP',
  'TRIANGLE_FAN'
];
const REFRESH_RATE = -2450;
const PI = Math.PI;

let cubeGeometry = new DynamicGeometry();
cubeGeometry.fromGeometry(new Box());
let displacement = [];
let vertexLength = cubeGeometry.getLength();
for (let i = 0; i < vertexLength; i++) {
  displacement.push()
}

Material.registerExpression('cubeFragment', {
  output: 4,
  glsl:
      `vec4(clamp(u_size[2] * 0.005, 0.0, 1.0), 1.0, 1.0, 1.0);`,
});

const MathMax = Math.max;
const MathMin = Math.min;
const geometry = new Box();
const SIZE = [20, 10, 10];
const COLORS = ColorRange.RAINBOW_HEX;

export default class Grid extends Node {
  constructor(audio) {
    super();
    this.audio = audio;

    let sx = SIZE[0] * this.audio.fftsize;
    let sy = SIZE[1] * this.audio.getData().TIMEBUFFER;
    console.log(sx, sy);

    this
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(sx, sy, 200)
      .setRotation(1.431170069931799, 1.564139751053517e-8, 0.6457718812057764)
      .setPosition(0, 100, -300);

    this.dragRotation = new DragRotation(this);
    this.cubes = [];
    let color = new Color(ColorRange.getRandomHex('dark'));
    let data = this.audio.getData();

    // for (let row = 0, depth = data.fftBufferFloat.length; row < depth; row++) {
    for (let row = 0, depth = 1; row < depth; row++) {
      let y = row / depth;
      this.cubes[row] = [];
      // for (let col = 0, width = data.fftBufferFloat[row].length; col < width; col++) {
      for (let col = 0, width = 1; col < width; col++) {
        let x = col / width;
        let cube = this.addChild(new Cube());
        cube.setAlign(x, y, 0);
        this.cubes[row][col] = cube;
      }
    }
    this.setRefreshRate(0.5);
    this.setSmoothing(0.5);
    this.setAmplitude(0.5);
  }

  updateItems(data) {
    let offset;
    // for (let row = 0, depth = data.fftBufferFloat.length; row < depth; row++) {
    for (let row = 0, depth = 1; row < depth; row++) {
      for (let col = 0, width = 1; col < width; col++) {
      // for (let col = 0, width = data.fftBufferFloat[row].length; col < width; col++) {
        offset = ((data.fftBufferFloat[row][col] + 90) * -0.025) - 0.5;
        offset *= 20;
        // if (offset > 0.5) offset = 0.5;
        // let val = MathMin((offset * -1 * this.amplitude), 2.5);
        let val = offset * -1 * this.amplitude;
        if (val < 1) val = 1;
        this.cubes[row][col].setScale(null, null, val);
        let color = COLORS[Math.floor(val / COLORS.length)];
        // this.cubes[row][col].updateColor(color);
      }
    }
    // debugger;
  }

  setSmoothing(v) {
    this.audio.analyser.smoothingTimeConstant = v;
  }

  setRefreshRate(v) {
    this.audio.refreshRate = (1 - v) * 50;
  }

  setAmplitude(v) {
    this.amplitude = v * 2;
  }
}

class Cube extends Node {
  constructor() {
    super();
    this
      .setOrigin(0.5, 0.5, 0)
      .setMountPoint(0.5, 0.5, 0.5)
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(SIZE[0], SIZE[1], SIZE[2]);
    this.mesh = new Mesh(this);
    this.mesh.setGeometry(geometry);
    this.mesh.setBaseColor(Material.cubeFragment());
  }
  // updateColor(newColor) {
  //   this.color.set(newColor);
  //   this.mesh.setBaseColor(this.color);
  // }
}
