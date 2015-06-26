import Camera from 'famous/components/Camera';
import FamousEngine from 'famous/core/FamousEngine';

import CenterPiece from './CenterPiece';
import OuterPiece from './OuterPiece';
import Lights from './Lights';
import ExplodeGeometry from './components/ExplodeGeometry';
import Audio from './utils/Audio';

// import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
// import Sphere from 'famous/webgl-geometries/primitives/Sphere';
// import Material from 'famous/webgl-materials/Material';
// import Mesh from 'famous/webgl-renderables/Mesh';

require('./styles.css');
FamousEngine.init();

const PRIMITIVE_TYPES = [
  'POINTS',
  'LINES',
  'LINE_STRIP',
  'LINE_LOOP',
  'TRIANGLES',
  'TRIANGLE_STRIP',
  'TRIANGLE_FAN'
];

class Vizzy {
  init() {
    this.scene = FamousEngine.createScene()
    this.camera = new Camera(this.scene);
    this.camera.setDepth(600);
    this.root = this.scene.addChild()
    this.lowpass = this.root.addChild()
      .setSizeMode(1, 1, 1)
      .setAbsoluteSize(20, 20, 20)
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setPosition(0, 0, 0);
    this.lowpassGeometry = new ExplodeGeometry(this.lowpass, {
      type: PRIMITIVE_TYPES[1]
    });
    // this.highpass = this.root.addChild()
    //   .setSizeMode(1, 1, 1)
    //   .setAbsoluteSize(20, 20, 20)
    //   .setAlign(0.5, 0.5, 0.5)
    //   .setOrigin(0.5, 0.5, 0.5)
    //   .setMountPoint(0.5, 0.5, 0.5)
    //   .setPosition(200, 0, 0);
    // this.highpassGeometry = new ExplodeGeometry(this.highpass, {
    //   type: PRIMITIVE_TYPES[1]
    // });
    // this.explodeGeometry.start();
    // this.geometry = new DynamicGeometry();
    // this.sphere = new Sphere( { detail: 100 } );
    // this.geometry.fromGeometry(this.sphere);
    // this.centerPiece = this.root.addChild(new CenterPiece());
    // this.outerPiece = this.root.addChild(new OuterPiece());
    this.lights = this.root.addChild(new Lights());
    this.audio = new Audio();
    this.id = this.root.addComponent(this);
    this.root.requestUpdate(this.id);
  }
  onUpdate() {
    this.lowpassGeometry.updateVertexBuffer(this.audio.getData());
    this.root.requestUpdateOnNextTick(this.id);
  }
}

let vizzy = new Vizzy();
vizzy.init();
