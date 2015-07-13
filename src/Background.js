import DOMElement from 'famous/dom-renderables/DOMElement';
import Node from 'famous/core/Node';
import Opacity from 'famous/components/Opacity';

export default class Background extends Node {
  constructor() {
    super();
    this
      .setAlign(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setProportionalSize(1, 1)
      .setPosition(0, 0, -1000);
    this.opacity = new Opacity(this);
    this.opacity.set(1);
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
    this.opacity.set(0.0, {duration: 300});
  }
}
