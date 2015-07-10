import FamousEngine from 'famous/core/FamousEngine';

export default class RefreshRate {
  constructor(rate) {
    this.clock = FamousEngine.getClock();
    this.lastInterval = this.clock.now();
    this.setRate(rate);
  }
  setRate(rate) {
    this.refreshRate = (1 - (rate || 50)) * 50;
  }
  getRate() {
    return this.refreshRate;
  }
  throttle(fn) {
    if (this.clock.now() - this.lastInterval > this.refreshRate) {
      fn(this.lastInterval, this.refreshRate);
      this.lastInterval = this.clock.now();
    }
  }
}
