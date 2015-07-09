import Camera from 'famous/components/Camera';
import FamousEngine from 'famous/core/FamousEngine';

import CenterPiece from './CenterPiece';
import OuterPiece from './OuterPiece';
import Lights from './Lights';
import Grid from './Grid';
import Audio from './utils/Audio';

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
    this.lights = this.root.addChild(new Lights());
    this.audio = new Audio(this.root);
    this.grid = this.root.addChild(new Grid(this.audio));
    this.id = this.root.addComponent(this);
    this.root.requestUpdate(this.id);
  }
  onUpdate() {
    this.grid.updateItems(this.audio.getData());
    this.root.requestUpdateOnNextTick(this.id);
  }
}

let vizzy = new Vizzy();
vizzy.init();
