import Camera from 'famous/components/Camera';
import FamousEngine from 'famous/core/FamousEngine';

import Background from './Background';
import CenterPiece from './CenterPiece';
import OuterPiece from './OuterPiece';
import Lights from './Lights';

const PRIMITIVE_TYPES = [
  'POINTS',
  'LINES',
  'LINE_STRIP',
  'LINE_LOOP',
  'TRIANGLES',
  'TRIANGLE_STRIP',
  'TRIANGLE_FAN'
];

FamousEngine.init();

class Vizzy {
  init() {
    this.scene = FamousEngine.createScene()
    this.camera = new Camera(this.scene);
    this.camera.setDepth(2000);
    this.root = this.scene.addChild()
    this.outerPiece = this.root.addChild(new OuterPiece());
    // this.background = this.root.addChild(new Background());
    this.lights = this.root.addChild(new Lights());
    this.centerPiece = this.root.addChild(new CenterPiece());
  }
}

let vizzy = new Vizzy();
vizzy.init();
