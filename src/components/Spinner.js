
export class SpinnerX {
  constructor(node, options = {}) {
    this.node = node;
    this.speed = options.speed || 2000;
    this.id = this.node.addComponent(this);
    this.node.requestUpdate(this.id);
  }
  onUpdate(time) {
    this.node.setRotation(time / this.speed, 0, 0);
    this.node.requestUpdateOnNextTick(this.id);
  }
}

export class SpinnerY {
  constructor(node, options = {}) {
    this.node = node;
    this.speed = options.speed || 2000;
    this.id = this.node.addComponent(this);
    this.node.requestUpdate(this.id);
  }
  onUpdate(time) {
    this.node.setRotation(0, time / this.speed, 0);
    this.node.requestUpdateOnNextTick(this.id);
  }
}

export class SpinnerZ {
  constructor(node, options = {}) {
    this.node = node;
    this.speed = options.speed || 2000;
    this.id = this.node.addComponent(this);
    this.node.requestUpdate(this.id);
  }
  onUpdate(time) {
    this.node.setRotation(0, 0, time / this.speed);
    this.node.requestUpdateOnNextTick(this.id);
  }
}
