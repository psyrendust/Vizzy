import Camera from 'famous/components/Camera';
import DOMElement from 'famous/dom-renderables/DOMElement';
import FamousEngine from 'famous/core/FamousEngine';
import Node from 'famous/core/Node';
import Opacity from 'famous/components/Opacity';

import Background from './Background';
import Lights from './Lights';
import Grid from './Grid';
import Audio from './utils/Audio';
import RefreshRate from './utils/RefreshRate';

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
    this.camera.setDepth(120);
    this.root = this.scene.addChild()
    this.background = this.root.addChild(new Background());
    this.lights = this.root.addChild(new Lights());
    this.audio = new Audio(this.root);
    this.grid = new Grid(this.root.addChild(), this.audio);
    this.data = {};
    this.refreshRate = new RefreshRate(100);
    this.id = this.root.addComponent(this);
    this.root.requestUpdate(this.id);
  }
  onUpdate() {
    this.data = this.audio.getData();
    // this.refreshRate.throttle(() => {
    //   if (this.data.fftBufferFloat[0]) {
    //     if (this.data.fftBufferFloat[0][this.data.fftSize - 8] > -90) {
    //       this.background.show();
    //     } else {
    //       this.background.hide();
    //     }
    //   } else {
    //     this.background.hide();
    //   }
    // });
    this.grid.updateItems(this.data);
    this.root.requestUpdateOnNextTick(this.id);
  }
}

let vizzy = new Vizzy();
vizzy.init();
