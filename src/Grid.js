import Color from 'famous/utilities/Color';
import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import GeometryHelper from 'famous/webgl-geometries/GeometryHelper';
import Material from 'famous/webgl-materials/Material';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import Plane from 'famous/webgl-geometries/primitives/Plane';
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

export default class Grid extends Node {
  constructor(audio, lights) {
    super();
    this
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(400, 1000, 400)
      .setRotation(1.431170069931799, 1.564139751053517e-8, 0.6457718812057764)
      .setPosition(0, 100, -300);

    this.audio = audio;
    this.lights = lights;

    this.dragRotation = new DragRotation(this);
    this.color = new Color(ColorRange.getRandomHex('dark'));
    this.mesh = new Mesh(this);
    this.geometry = new DynamicGeometry();

    this.plane = new Plane({
      detailY: this.audio.getData().TIMEBUFFER - 1,
      detailX: this.audio.getData().bufferLength - 1
    });

    this.geometry.fromGeometry(this.plane);
    this.geometry.setDrawType(PRIMITIVE_TYPES[1]);
    // this.mesh.setFlatShading(true);

    this.mesh.setNormals(vertexShader);
    this.mesh.setBaseColor(Material.vizzyFS());

    this.mesh.setGeometry(this.geometry);
    this.mesh.setDrawOptions({
      side: 'double'
    });

    this.indices = this.geometry.getVertexBuffer('indices');

    this.vtxPositions = this.geometry.getVertexPositions();
    this.vtxPositionsStatic = JSON.parse(JSON.stringify(this.vtxPositions));
    this.cachedNormals = this.geometry.getNormals();
    this.normals = [];
    for (let i = 0; i < this.vtxPositions.length; i++) {
      this.normals[i] = new Vec3();
    }
    this.setRefreshRate(0.5);
    this.setSmoothing(0.5);
    this.setAmplitude(0.5);
  }

  updateItems(data) {
    if (this.geometry) {
      var row = 0;
      var col = 0;
      for (let i = 0; i < this.vtxPositions.length; i += 3) {
        if (data.fftBufferFloat[row]) {
          let offset = ((data.fftBufferFloat[row][col++] + 90) * -0.025) - 0.5;
          if (offset > 0.5) offset = 0.5;
          if (row === 30 && col === 5) {
            let lightOffset = (offset * -2) + 0.40;
            this.lights.color.setColor([lightOffset, lightOffset, lightOffset]);
          }
          this.vtxPositions[i + 0] = this.vtxPositionsStatic[i + 0];
          this.vtxPositions[i + 1] = this.vtxPositionsStatic[i + 1];
          this.vtxPositions[i + 2] = this.vtxPositionsStatic[i + 2] + (offset * -1 * this.amplitude);
          if (col >= data.bufferLength) {
            row++;
            col = 0;
          }
        }
      }
      this.geometry.setVertexPositions(this.vtxPositions);
      this.geometry.setNormals(GeometryHelper.computeNormals(this.indices, this.vtxPositions, this.normals));
      this.mesh.setGeometry(this.geometry);
    }
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
