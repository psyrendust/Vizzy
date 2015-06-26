import Color from 'famous/utilities/Color';
import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import Geometry from 'famous/webgl-geometries/Geometry';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import OBJLoader from 'famous/webgl-geometries/OBJLoader';
import Material from 'famous/webgl-materials/Material';
import Sphere from 'famous/webgl-geometries/primitives/Sphere';
import ExplodeGeometry from './components/ExplodeGeometry';

const PRIMITIVE_TYPES = [
  'POINTS',
  'LINES',
  'LINE_STRIP',
  'LINE_LOOP',
  'TRIANGLES',
  'TRIANGLE_STRIP',
  'TRIANGLE_FAN'
];
const size = 100;

export default class OuterPiece extends Node {
  constructor() {
    super();
    this
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(size, size, size)
      .setAlign(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setPosition(0, 0, 0);

    this.color = new Color('#ff0099');
    this.mesh = new Mesh(this);
    this.amplitude = 0;
    this.frame = 0;
    this.sphere = new Sphere( { detail: 100 } );
    console.log(this.sphere);
    this.effect = new ExplodeGeometry(this, this.mesh, this.sphere);
    // this.effect = new ExplodeGeometry(this, 'explode', this.mesh, this.sphere, (time, vertex, geometry, vars) => {
    //   this.amplitude = (0.1 * Math.sin(this.frame * 0.25) + 0.7);
    //   vertex.setUniform(vars.u_Amplitude, amplitude);
    //   this.frame += 0.1;
    // });
    // this.effect.start();
  }
  // load() {
  //   OBJLoader.load('sphereSimple.obj', (geometries) => {
  //     let buffers = geometries[0];
  //     this.vtxPositions = buffers.vertices;
  //     this.mesh = new Mesh(this);
  //     this.color = new Color('#ffffff');

  //     this.geometry = new DynamicGeometry();
  //     this.geometry.fromGeometry(new Geometry({
  //       buffers: [
  //         { name: 'a_pos', data: buffers.vertices, size: 3 },
  //         { name: 'a_normals', data: buffers.normals, size: 3 },
  //         { name: 'a_texCoords', data: buffers.textureCoords, size: 2 },
  //         { name: 'indices', data: buffers.indices, size: 1 }
  //       ]
  //     }));
  //     this.mesh.setGeometry(this.geometry);
  //     this.mesh.setBaseColor(this.color);
  //     this.randomizeVertexPositions();
  //   });
  // }
  // randomizeVertexPositions() {
  //   let currVtxPositions = this.geometry.getVertexPositions();
  //   let counter = {
  //     isArray: 0,
  //     isNumber: 0
  //   };
  //   currVtxPositions.forEach(function(val) {
  //     if (Array.isArray(val)) {
  //       counter.isArray++;
  //     } else {
  //       counter.isNumber++;
  //     }
  //   })
  //   console.log(counter);
  //   // let newVtxPositions = [];
  //   // let len = this.vtxPositions.length;
  //   // let modifier;
  //   // let newVal;
  //   // let i;
  //   // for (i = 0; i < len; i++) {
  //   //   modifier = Math.random() * 2;
  //   //   let pos = this.vtxPositions[i];
  //   //   if (Array.isArray(pos)) {
  //   //     newVtxPositions[i] = pos.map(function(val, i) {
  //   //       return val + modifier * (Math.random() < 0.5 ? -1 : 1);
  //   //     });
  //   //   } else {
  //   //     newVtxPositions[i] = pos + modifier * (Math.random() < 0.5 ? -1 : 1);
  //   //   }
  //   // }
  //   // this.geometry.setVertexPositions(newVtxPositions);
  //   // this.mesh.setGeometry(this.geometry);
  // }
}
