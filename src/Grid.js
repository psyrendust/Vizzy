import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import FamousEngine from 'famous/core/FamousEngine';
import Material from 'famous/webgl-materials/Material';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import Plane from 'famous/webgl-geometries/primitives/Plane';
import Vec3 from 'famous/math/Vec3';

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

const MathMax = Math.max;
const MathMin = Math.min;
Material.registerExpression('vizzyVS', {
  output: 3,
  glsl: 'vizzyColor();',
  defines: `
    vec3 vizzyColor() {
      v_amplitude = a_pos;
      return vec3(0.0);
    }`
});

Material.registerExpression('vizzyFS', {
  output: 4,
  glsl: `
  vec4(
    clamp((v_amplitude.z * u_blend * u_color[0]), 0.3, 1.0),
    clamp((v_amplitude.z * u_blend * u_color[1]), 0.6, 1.0),
    clamp((v_amplitude.z * u_blend * u_color[2]), 0.8, 1.0),
    clamp(v_amplitude.z, 0.0, 0.9)
  );`
});

const vizzyVS = Material.vizzyVS(null, {
  uniforms: {
    u_color: [1.0, 0.0, 0.9],
    u_blend: 0.799
  },
  varyings: {
    v_amplitude: [0.0, 0.0, 0.0]
  }
});

export default class Grid extends Node {
  constructor(audio) {
    super();
    // gl_PointSize = 20.0;


    this
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(1100, 2800, 800)
      .setRotation(1.291543634104166, -2.696416956382564e-8, 1.9547687175892083)
      .setPosition(0, 200, -200);

    this.clock = FamousEngine.getClock();
    this.audio = audio;

    this.mesh = new Mesh(this);
    this.geometry = new DynamicGeometry();
    this.dragRotation = new DragRotation(this);

    this.plane = new Plane({
      detailY: this.audio.getData().TIMEBUFFER - 1,
      detailX: this.audio.getData().bufferLength - 1
    });

    this.geometry.fromGeometry(this.plane);
    this.geometry.setDrawType(PRIMITIVE_TYPES[1]);
    this.mesh.setGeometry(this.geometry);
    this.mesh.setFlatShading(true);
    this.mesh.setPositionOffset(vizzyVS);
    // TODO: (0.6.2) Have to setBaseColor in a setTimeout because of GL ERROR: "'v_amplitude' : undeclared identifier " in line 99
    setTimeout(() => {
      this.mesh.setBaseColor(Material.vizzyFS());
    }, 10);

    this.indices = this.geometry.getVertexBuffer('indices');
    this.vtxPositions = this.geometry.getVertexPositions();
    this.vtxPositionsStatic = JSON.parse(JSON.stringify(this.vtxPositions));
    this.setRefreshRate(0.5);
    this.setSmoothing(0.5);
    this.setAmplitude(0.5);

    // TODO: See TODO below in updateItems
    // this.cachedNormals = this.geometry.getNormals();
    // this.normals = new Float32Array(this.vtxPositions.length);
    // for (let i = 0; i < this.vtxPositions.length; i++) {
    //   this.normals[i] = new Vec3();
    // }
  }

  updateItems(data) {
    if (this.geometry) {
      let row = 0;
      let col = 0;
      let maxVal = 0;
      let offset;
      for (let i = 0; i < this.vtxPositions.length; i += 3) {
        if (data.fftBufferFloat[row]) {
          offset = ((data.fftBufferFloat[row][col++] + 90) * -0.025) - 0.5;
          if (offset > 0.5) offset = 0.5;
          let val = MathMin(this.vtxPositionsStatic[i + 2] + (offset * -1 * this.amplitude), 2.5);
          if (val <= -0.5) val = -0.5;
          this.vtxPositions[i + 2] = val;
        } else {
          col++;
          this.vtxPositions[i + 0] = 0;
          this.vtxPositions[i + 1] = 0;
          this.vtxPositions[i + 2] = 0;
        }
        if (col >= data.bufferLength) {
          row++;
          col = 0;
        }
      }
      this.geometry.setVertexPositions(this.vtxPositions);
      // TODO: Not sure I need this, but it's ok since there is a performance hit when calling computeNormals as of 0.6.2
      // this.normals = GeometryHelper.computeNormals(this.indices, this.vtxPositions, this.cachedNormals);
      // this.geometry.setNormals(this.normals);
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
