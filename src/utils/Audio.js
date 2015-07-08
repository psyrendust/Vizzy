// const FFTSIZE = 128;
const FFTSIZE = 128;
const TIMEBUFFER = 128;
const REFRESH_RATE = 50;

export default class Audio {
  constructor(node, params = {}) {
    this.node = node;
    this.audioElements = document.querySelectorAll('.vizzyMedia');
    this.totalTracks = this.audioElements.length;
    this.isPlaying = false;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioCtx.createGain();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = 0;
    this.analyser.smoothingTimeConstant = 0.5;
    this.analyser.fftSize = FFTSIZE;
    this.refreshRate = REFRESH_RATE;
    this.data = {
      bufferLength: this.analyser.frequencyBinCount,
      fftBufferFloat: [],
      fftBufferByte: [],
      TIMEBUFFER: TIMEBUFFER
    };
    this.dataArrayFloat = new Float32Array(this.data.bufferLength);
    this.dataArrayByte = new Uint8Array(this.data.bufferLength);
    this.id = this.node.addComponent(this);
    this.buffers = [];
    this.elements = [];
    this.index = 1;
    this.loaded = 0;

    this.config = {
      autoPlay: params.autoPlay || false,
      loop: params.loop || false,
      volume: params.volume || 1
    };

    this.gainNode.gain.value = this.config.volume;

    for (let i = 0; i < TIMEBUFFER; i++) {
      let bufferFloat = new Float32Array(this.data.bufferLength);
      let bufferByte = new Uint8Array(this.data.bufferLength);
      for (let j = 0; j < bufferFloat.length; j++) {
        bufferFloat[j] = -110.0;
        bufferByte[j] = 0;
      }
      this.data.fftBufferFloat.push(bufferFloat);
      this.data.fftBufferByte.push(bufferByte);
    }

    console.log('-- start preload');
    for (let i = 0; i < this.totalTracks; i++) {
      this.ajax({
        file: this.audioElements[i].src,
        id: i
      });
    }
    console.log('-- cleanup audio tags');
    for (let i = 0; i < this.totalTracks; i++) {
      this.audioElements[i].parentNode.removeChild(this.audioElements[i]);
    }
  }

  ajax(params) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.config = {
      id: params.id,
      url: params.file
    };
    httpRequest.addEventListener('load', () => {
      console.log('---- loaded: ' + httpRequest.config.url);
      this.decodeAudioData(httpRequest);
    }, false);

    try {
      console.log('-- ajax: ' + params.file);
      httpRequest.open('GET', params.file, true);
      httpRequest.responseType = 'arraybuffer';
      httpRequest.send();
    } catch (e) {
      window.console.log(e);
    }
  }

  decodeAudioData(httpRequest) {
    console.log('-- decodingAudioData: ' + httpRequest.config.url);
    this.audioCtx.decodeAudioData(httpRequest.response, (buffer) => {
      let source = this.audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioCtx.destination);
      source.connect(this.analyser);
      source.onended = (e) => {
        console.log('onended');
        this.nextSong();
      };
      source.loop = this.config.loop;
      this.buffers[httpRequest.config.id] = {
        id: httpRequest.config.id,
        source: source,
        buffer: buffer
      };
      this.decodeAudioDataComplete(httpRequest.config.url);
    });
  }

  decodeAudioDataComplete(id) {
    console.log('---- decodeAudioDataComplete: ' + id);
    this.loaded += 1;
    if (this.loaded >= this.totalTracks) {
      this.currentTime = Date.now();
      this.onUpdate();
      this.nextSong();
    }
  }

  onUpdate() {
    if (Date.now() - this.currentTime > this.refreshRate) {
      this.analyser.getFloatFrequencyData(this.dataArrayFloat);
      this.analyser.getByteFrequencyData(this.dataArrayByte);
      for (let i = this.data.TIMEBUFFER - 1; i > 0; i--) {
        for (let j = 0; j < this.data.bufferLength; j++) {
          this.data.fftBufferFloat[i][j] = this.data.fftBufferFloat[i - 1][j];
          this.data.fftBufferByte[i][j] = this.data.fftBufferByte[i - 1][j];
        }
      }
      for (let i = 0; i < this.data.bufferLength; i++) {
        this.data.fftBufferFloat[0][i] = this.dataArrayFloat[i];
        this.data.fftBufferByte[0][i] = this.dataArrayByte[i];
      }
      this.currentTime = Date.now();
    }
    this.node.requestUpdateOnNextTick(this.id);
  }

  getSource() {
    return this.buffers[this.index].source;
  }

  // Get the current byte frequency data
  getData() {
    return this.data;
  }

  prevSong() {
    this.pause();
    this.index--;
    if (this.index < 0) {
      this.index = this.totalTracks - 1;
    }
    this.rewind();
    this.play();
  }

  nextSong() {
    this.pause();
    this.index++;
    if (this.index >= this.totalTracks) {
      this.index = 0;
    }
    this.rewind();
    this.play();
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      let source = this.getSource();
      if (source.noteOff) source.noteOff(0);
      else if (source.stop) source.stop(0);
      else if (source.pause) source.pause();
    }

  }

  play() {
    let source = this.getSource();
    this.duration = source.buffer.duration;
    if (source.noteOn) {
      console.log('-- play: noteOn');
      source.noteOn(this.getSource().currentTime);
      // source.noteGrainOn(this.getSource().currentTime, this.duration - 15, null);
    } else if (source.start) {
      console.log('-- play: start');
      source.start(this.getSource().currentTime);
    } else if (source.play) {
      console.log('-- play: play');
      source.play();
    }
    this.isPlaying = true;
  }

  rewind() {
    this.pause();
    this.getSource().currentTime = 0;
  }
}
