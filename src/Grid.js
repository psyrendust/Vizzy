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

const shader = `
vec3 vizzy() {
  v_normal[0] = (u_colorA[0] + (a_pos[2] * u_blend * -1.0) * (u_colorB[0] - u_colorA[0]));
  v_normal[1] = (u_colorA[1] + (a_pos[2] * u_blend * -1.0) * (u_colorB[1] - u_colorA[1]));
  v_normal[2] = (u_colorA[2] + (a_pos[2] * u_blend * -1.0) * (u_colorB[2] - u_colorA[2]));
  return v_normal - a_normals;
}`;

Material.registerExpression('vizzyVS', {
  output: 3,
  glsl: `vizzy();`,
  defines: shader
});

Material.registerExpression('vizzyFS', {
  output: 4,
  glsl: `vec4(v_normal[0], v_normal[1], v_normal[2], 1.0);`
});

let vertexShader = Material.vizzyVS(null, {
  uniforms: {
    u_colorA: [0.0, 0.2, 0.8],
    u_colorB: [0.9, 0.1, 0.0],
    u_blend: 0.25
  }
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
    // this.color = new Color(ColorRange.getRandomHex('dark'));
    this.cubes = [];
    let color = new Color(ColorRange.getRandomHex('dark'));
    let data = this.audio.getData();

    for (let row = 0, depth = data.fftBufferFloat.length; row < depth; row++) {
      let y = row / depth;
      this.cubes[row] = [];
      for (let col = 0, width = data.fftBufferFloat[row].length; col < width; col++) {
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
    // if (this.geometry) {
      let offset;
      for (let row = 0, depth = data.fftBufferFloat.length; row < depth; row++) {
        for (let col = 0, width = data.fftBufferFloat[row].length; col < width; col++) {
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
    //   for (let i = 0; i < this.vtxPositions.length; i += 3) {
    //     if (data.fftBufferFloat[row]) {
    //       offset = ((data.fftBufferFloat[row][col++] + 90) * -0.025) - 0.5;
    //       if (offset > 0.5) offset = 0.5;
    //       // if (row === 30 && col === 5) {
    //       //   let lightOffset = (offset * -2) + 0.40;
    //       //   this.lights.color.setColor([lightOffset, lightOffset, lightOffset]);
    //       // }
    //       // this.vtxPositions[i + 0] = this.vtxPositionsStatic[i + 0];
    //       // this.vtxPositions[i + 1] = this.vtxPositionsStatic[i + 1];
    //       let val = MathMin(this.vtxPositionsStatic[i + 2] + (offset * -1 * this.amplitude), 2.5);
    //       if (val <= -0.5) val = -0.5;
    //       this.vtxPositions[i + 2] = val;
    //     } else {
    //       col++;
    //       this.vtxPositions[i + 0] = 0;
    //       this.vtxPositions[i + 1] = 0;
    //       this.vtxPositions[i + 2] = 0;
    //     }
    //     if (col >= data.bufferLength) {
    //       row++;
    //       col = 0;
    //     }
    //   }
    //   this.geometry.setVertexPositions(this.vtxPositions);
    //   this.mesh.setGeometry(this.geometry);
    // }
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
    this.color = new Color('#ffffff');
    this.mesh = new Mesh(this);
    this.mesh.setGeometry(geometry);
    this.mesh.setBaseColor(this.color);
  }
  updateColor(newColor) {
    this.color.set(newColor);
    this.mesh.setBaseColor(this.color);
  }
}
