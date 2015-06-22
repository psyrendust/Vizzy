import Color from 'famous/utilities/Color';
import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import Geometry from 'famous/webgl-geometries/Geometry';
import Mesh from 'famous/webgl-renderables/Mesh';
import Node from 'famous/core/Node';
import OBJLoader from 'famous/webgl-geometries/OBJLoader';

const PRIMITIVE_TYPES = [
  'POINTS',
  'LINES',
  'LINE_STRIP',
  'LINE_LOOP',
  'TRIANGLES',
  'TRIANGLE_STRIP',
  'TRIANGLE_FAN'
];

export default class OuterPiece extends Node {
  constructor() {
    super();
    this
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(400, 400, 400)
      .setAlign(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setPosition(0, 0, 0);

    this.color = new Color('#ff0099');
    this.meshes = [];
    this.load();
  }
  load() {
    OBJLoader.load('sphere.obj', (geometries) => {
      let buffers = geometries;
      this.vtxPositions = buffers.vertices;
      this.mesh = new Mesh(this);
      this.color = new Color('#cccccc');

      this.geometry = new DynamicGeometry();
      this.geometry.fromGeometry(new Geometry({
        buffers: [
          { name: 'a_pos', data: buffers.vertices, size: 3 },
          { name: 'a_normals', data: buffers.normals, size: 3 },
          { name: 'a_texCoords', data: buffers.textureCoords, size: 2 },
          { name: 'indices', data: buffers.indices, size: 1 }
        ]
      }));
      this.mesh.setGeometry(this.geometry);
      this.mesh.setBaseColor(this.color);
    });
  }
}
