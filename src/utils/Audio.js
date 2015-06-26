const FFTSIZE = 128;
const FILTERS = {
  LOWPASS: ['lowpass', 0],
  HIGHPASS: ['highpass', 1],
  BANDPASS: ['bandpass', 2],
  LOWSHELF: ['lowshelf', 3],
  HIGHSHELF: ['highshelf', 4],
  PEAKING: ['peaking', 5],
  NOTCH: ['notch', 6],
  ALLPASS: ['allpass', 7],
};
const FREQ_BOTTOM = 700;
const FREQ_CENTER = 3000;
const FREQ_TOP = 4200;

export default class Audio {
  constructor() {
    this.element = document.getElementById('minipops');
    this.isPlaying = false;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.filterLowpass = this.audioCtx.createBiquadFilter();
    this.filterBandpass = this.audioCtx.createBiquadFilter();
    this.filterHighpass = this.audioCtx.createBiquadFilter();
    this.filterTypeIsString = (typeof this.filterLowpass.type === 'string') ? 0 : 1;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = 0;
    this.analyser.smoothingTimeConstant = 0.99;
    this.analyser.fftSize = FFTSIZE;
    this.configureLowpass();
    this.configureBandpass();
    this.configureHighpass();
    this.source = this.audioCtx.createMediaElementSource(this.element);
    this.source.connect(this.filterLowpass);
    this.source.connect(this.filterHighpass);
    // this.source.connect(this.audioCtx.destination);
    this.filterLowpass.connect(this.audioCtx.destination);
    this.filterLowpass.connect(this.analyser);
    // this.filterHighpass.connect(this.audioCtx.destination);
    // this.filterHighpass.connect(this.analyser);
    // this.filterBandpass.connect(this.audioCtx.destination);
    // this.filterBandpass.connect(this.analyser);
    this.start();
  }
  configureLowpass() {
    this.filterLowpass.type = FILTERS.LOWPASS[this.filterTypeIsString];
    this.filterLowpass.frequency.value = 120;
    // this.filterLowpass.Q.value = 0.9;
    this.filterLowpass.gain.value = 0;
  }
  configureBandpass() {
    this.filterBandpass.type = FILTERS.BANDPASS[this.filterTypeIsString];
    this.filterBandpass.frequency.value = FREQ_CENTER;
    this.filterBandpass.Q.value = FREQ_CENTER / (FREQ_TOP - FREQ_BOTTOM);
    this.filterBandpass.gain.value = 0;
  }
  configureHighpass() {
    this.filterHighpass.type = FILTERS.HIGHPASS[this.filterTypeIsString];
    this.filterHighpass.frequency.value = 7000;
    this.filterHighpass.gain.value = 0;
  }
  start() {
    this.element.addEventListener('loadeddata', () => {
      this.duration = this.element.duration;
      this.bufferLength = this.analyser.frequencyBinCount;
      // this.dataArray = new Float32Array(this.bufferLength);
      this.dataArray = new Uint8Array(this.bufferLength);
      this.element.play();
      this.isPlaying = true;
    });
    this.element.addEventListener('ended', () => {
      this.element.currentTime = 0;
      this.element.play();
    });
  }
  getData() {
    if (!this.isPlaying) return [];
    // this.analyser.getFloatFrequencyData(this.dataArray);
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }
}
