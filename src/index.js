import Camera from 'famous/components/Camera';
import FamousEngine from 'famous/core/FamousEngine';

import Background from './Background';
import Lights from './Lights';

FamousEngine.init();

class Vizzy {
  init() {
    this.scene = FamousEngine.createScene()
    this.camera = new Camera(this.scene);
    this.root = this.scene.addChild()
    this.background = this.root.addChild(new Background());
    this.lights = this.root.addChild(new Lights());
  }
}

let vizzy = new Vizzy();
vizzy.init();
