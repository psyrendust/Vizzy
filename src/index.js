import Camera from 'famous/components/Camera';
import DOMElement from 'famous/dom-renderables/DOMElement';
import FamousEngine from 'famous/core/FamousEngine';
import Node from 'famous/core/Node';
import Opacity from 'famous/components/Opacity';

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

class Background extends Node {
  constructor() {
    super();
    this
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setProportionalSize(1, 1)
      .setPosition(0, 0, 0);
    this.opacity = new Opacity(this);
    this.opacity.set(0);
    this.el = new DOMElement(this, {
      properties: {
        width: '100%',
        height: '100%',
        background: "#00b9d7",
        background: "-moz-radial-gradient(center, ellipse cover,  #00b9d7 0%, #9783f2 100%)",
        background: "-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,#00b9d7), color-stop(100%,#9783f2))",
        background: "-webkit-radial-gradient(center, ellipse cover,  #00b9d7 0%,#9783f2 100%)",
        background: "-o-radial-gradient(center, ellipse cover,  #00b9d7 0%,#9783f2 100%)",
        background: "-ms-radial-gradient(center, ellipse cover,  #00b9d7 0%,#9783f2 100%)",
        background: "radial-gradient(ellipse at center,  #00b9d7 0%,#9783f2 100%)",
        filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b9d7', endColorstr='#9783f2',GradientType=1 )"
      }
    });
    this.isShown = false;
  }
  show() {
    if (this.isShown) return;
    this.isShown = true;
    this.opacity.halt();
    this.opacity.set(0.3, {duration: 50});
  }
  hide() {
    if (!this.isShown) return;
    this.isShown = false;
    this.opacity.halt();
    this.opacity.set(0, {duration: 300});
  }
}

class Vizzy {
  init() {
    this.scene = FamousEngine.createScene()
    this.camera = new Camera(this.scene);
    this.camera.setDepth(120);
    this.root = this.scene.addChild()
    this.lowpass = this.root.addChild()
      .setSizeMode(1, 1, 1)
      .setAbsoluteSize(20, 20, 20)
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setPosition(0, 0, 0);
    this.background = this.root.addChild(new Background());
    this.lights = this.root.addChild(new Lights());
    this.audio = new Audio(this.root);
    this.grid = this.root.addChild(new Grid(this.audio, this.lights));
    this.id = this.root.addComponent(this);
    this.root.requestUpdate(this.id);
    this.data = {};
    this.currentTime = Date.now();
    this.refreshRate = 100;
  }
  onUpdate() {
    this.data = this.audio.getData();
    if (Date.now() - this.currentTime > this.refreshRate) {
      if (this.data.fftBufferFloat[0]) {
        if (this.data.fftBufferFloat[0][this.data.fftSize - 8] > -90) {
          this.background.show();
        } else {
          this.background.hide();
        }
      } else {
        this.background.hide();
      }
      this.currentTime = Date.now();
    }
    this.grid.updateItems(this.data);
    this.root.requestUpdateOnNextTick(this.id);
  }
}

let vizzy = new Vizzy();
vizzy.init();
