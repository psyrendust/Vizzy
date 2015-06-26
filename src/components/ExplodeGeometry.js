import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import FamousEngine from 'famous/core/FamousEngine';
import Material from 'famous/webgl-materials/Material';
import Mesh from 'famous/webgl-renderables/Mesh';
import Sphere from 'famous/webgl-geometries/primitives/Sphere';
import ShaderMaterial from './ShaderMaterial';
import {SpinnerY} from './Spinner';

export default class ExplodeGeometry {
  constructor(node, options = {}, callback) {
    const PRIMITIVE_TYPES = [
      'POINTS',
      'LINES',
      'LINE_STRIP',
      'LINE_LOOP',
      'TRIANGLES',
      'TRIANGLE_STRIP',
      'TRIANGLE_FAN'
    ];
    this.requestingUpdate = false;
    this.node = node;
    this.mesh = options.mesh || new Mesh(this.node);
    this.callback = callback;
    this.updateVertexBuffer();
    //-----------------------------------------------------------------------
    this.geometry = new DynamicGeometry({ type: PRIMITIVE_TYPES[4] });
    this.geometry.fromGeometry(new Sphere({ detail: 20 }));
    let displacement = [];
    for (let i = 0, len = this.geometry.getLength(); i < len; i++) {
      displacement.push(Math.random() * (Math.random() > 0.5 ? 1.3 : 0.2));
    }
    this.shader = new ShaderMaterial('explode', {
      geometry: this.geometry,
      vertexShader: [
`vec3 explodeDisplacement() {
    v_Displacement = a_Displacement;
    return a_normals * vec3(a_Displacement * 10.0 * u_Amplitude);
}`, 'explodeDisplacement();', 3],
      fragmentShader: [
`vec4(
    clamp(v_Displacement * u_Red * 3.0 - 0.3, 0.0, 1.0),
    clamp(v_Displacement * u_Green * 3.0 - 0.3, 0.0, 1.0),
    clamp(v_Displacement * u_Blue * 3.0 - 0.3, 0.0, 1.0),
    1.0
);`,
       4],
      defaults: {
        a_Displacement: 1,
        u_Amplitude: 1,
        u_Red: 1,
        u_Green: 1,
        u_Blue: 1,
        v_Displacement: 1
      },
      vertexBuffers: [
        ['a_Displacement', displacement, 1]
      ]
    });
    //-----------------------------------------------------------------------
    // this.mesh.setFlatShading(true);
    this.mesh.setGeometry(this.geometry);
    //-----------------------------------------------------------------------
    this.mesh.setPositionOffset(this.shader.vertexShader);
    this.mesh.setBaseColor(this.shader.fragmentShader);
    //-----------------------------------------------------------------------
    this.spinner = new SpinnerY(this.node, { speed: -6000 });
    this.frame = 0;
    this.amplitude = 0;
    this.rotation = 0;
    this.maxFrequency = 256;
    this.data = [];
  }
  start() {
    if (!this.requestingUpdate) {
      this.requestingUpdate = true;
      this.node.requestUpdate(this.id);
      this.randomize();
    }
  }
  stop() {
    this.requestingUpdate = false;
  }

  updateVertexBuffer(data) {
    this.data = data;
    if (this.geometry) {
      let vtxPositions = this.geometry.getVertexPositions();
      let len = vtxPositions.length;
      let counter = 0;
      let dataLen = this.data.length - 1;
      let i;
      let val
      for (i = 0; i < len; i += 3) {
        counter++;
        if (counter >= dataLen) counter = 0;
        val = (this.data[counter]/this.maxFrequency) * 400;;
        vtxPositions[i + 0] = val * Math.random() > 0.5 ? -1 : 1;
        vtxPositions[i + 1] = val * Math.random() > 0.5 ? -1 : 1;
        vtxPositions[i + 2] = val * Math.random() > 0.5 ? -1 : 1;
        // vtxPositions[i + 0] = this.data[counter] * 0.2 * Math.random() > 0.5 ? -1 : 1;
        // vtxPositions[i + 1] = this.data[counter] * 0.2 * Math.random() > 0.5 ? -1 : 1;
        // vtxPositions[i + 2] = this.data[counter] * 0.2 * Math.random() > 0.5 ? -1 : 1;
      }
      let max = 0;
      let min = Infinity;
      for (i = 0; i < dataLen; i++) {
        if (this.data[i] >= max) {
          max = this.data[i];
        }
      }
      // debugger;
      this.shader.vertexShader.setUniform('u_Red', max * Math.random() * 0.02);
      this.shader.vertexShader.setUniform('u_Green', max * Math.random() * 0.02);
      this.shader.vertexShader.setUniform('u_Blue', max * Math.random() * 0.02);
      this.geometry.setVertexPositions(vtxPositions);
      this.mesh.setGeometry(this.geometry);
      this.node.setRotation();
    }
  }
  onUpdate(time) {
    if (this.requestingUpdate) {
      let delta = Date.now() * 0.0003;
      // this.node.setRotation(null, delta);
      if (this.callback) {
        this.callback(time, this.vertex, this.geometry);
      } else {
        this.amplitude = (0.1 * Math.sin(this.frame * 0.25) + 0.7);
        // this.explodeVertex.setUniform('u_Amplitude', this.amplitude);
        this.shader.vertexShader.setUniform('u_Amplitude', this.amplitude);
        this.frame += 0.1;
      }
      this.mesh.onUpdate();
      this.node.requestUpdateOnNextTick(this.id);
    }
  }
}
