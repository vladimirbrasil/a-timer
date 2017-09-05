/*
  https://developers.google.com/web/fundamentals/architecture/building-components/best-practices#avoid-reentrancy
*/

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }
  </style>
  <template>
    <div id="time"></div>
  </template>
`;

// const io = new IntersectionObserver(entries => {
//   for(const entry of entries) {
//     if(entry.isIntersecting) {
//       entry.target.setAttribute('full');
//     }
//   }
// });

class ATimerRaw extends HTMLElement {
  static get observedAttributes() {
    return ['start-time', 'current-time', 'run', 'resetProp', 'finished'];
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // const hasValue = newValue !== null;
    // switch (name) {
    //   case 'startTime':
    //     // Note the attributeChangedCallback is only handling the *side effects*
    //     // of setting the attribute.
    //     // this.setAttribute('aria-checked', hasValue);
    //     break;
  }

  connectedCallback() {
    if (!this.hasAttribute('start-time'))
      this.setAttribute('start-time', 30);
    if (!this.hasAttribute('current-time'))
      this.setAttribute('current-time', this.startTime);
    this.removeAttribute('run');
    this.removeAttribute('resetProp');
    this.int = setInterval(() => console.log(this.currentTime), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.int);
  }

  /**
  * Start time.
  */
  set startTime(value) {
    if (value <= this.currentTime) this.currentTime = value;
    this.setAttribute('start-time', value || 30);
  }
  get startTime() {
    return this.getAttribute('start-time');
  }

  /**
  * Current time.
  */
  set currentTime(value) {
    this.lastCurrentTime = this.getAttribute('current-time');
    this.setAttribute('current-time', value || this.startTime);
  }
  get currentTime() {
    if (this.run) this.currentTime = this._updateCurrentTime();
    return this.getAttribute('current-time');
  }

  get _now() {
    return (new Date()).getTime();
  }

  _updateCurrentTime() {
    return (this._dateAhead - this._now)/1000;
  }

  _setDateAhead() {
    const now = this._now;
    this.timeoutPeriod = this.currentTime*1000;
    this._dateAhead = now + this.timeoutPeriod;
    console.log(this.currentTime) //, now/1000, this._dateAhead/1000);    
  }

  /**
  * Current time.
  */
  set lastCurrentTime(value) {
    this.setAttribute('last-current-time', value || this.currentTime);
  }
  get lastCurrentTime() {
    return this.getAttribute('last-current-time');
  }
  
  /**
  * A property, instead of a traditional method, to start/stop the timer.
  */
  set run(value) {
    const wasRunning = this.run;
    const isRunning = Boolean(value);
    if (wasRunning === isRunning) return;
    if (isRunning) {
      this._setDateAhead();
      this.setAttribute('run', '');
      this._start();
    }
    else {
      this.removeAttribute('run');
      // console.log('o3', this.currentTime)     
      this._stop();
      // this.stop();
      // console.log('o4', this.currentTime)     
    }



  }
  get run() {
    return this.hasAttribute('run');
  }

  
  set resetProp(value) {
    const isReset = Boolean(value);
    if (isReset)
      this._reset();
    this.removeAttribute('reset-prop');
  }
  get resetProp() {
    return this.hasAttribute('reset-prop');
  }

  /**
  * A property, instead of a traditional method, to start/stop the timer.
  */
  set finished(value) {
    const wasFinished = this.finished;
    const isFinished = Boolean(value);
    if (wasFinished === isFinished) return;
    if (isFinished) {
      const currentTime = this.currentTime;
      // console.log(currentTime);
      this.setAttribute('finished', '');
      this.dispatchEvent(new CustomEvent('finish'), { detail: currentTime }); 
      // console.log('oi', this.currentTime)     
      if (this.run) this.run = false;
      // console.log('oi2', this.currentTime)     
    }
    else
      this.removeAttribute('finished');
  }
  get finished() {
    return this.hasAttribute('finished');
  }

  /**
  * Starts the timer.
  */
  start() {
    if (!this.run) this.run = true;
  }

  /**
  * Stops the timer.
  */
  stop() {
    if (this.run) this.run = false;
  }

  /**
  * Resets the timer.
  */
  reset() {
    if (!this.resetProp) this.resetProp = true;
  }

  _start() {
    // console.log('_start')
    // const now = this._now;
    // const timeoutPeriod = this.currentTime*1000;
    // const timeoutPeriod = this._setDateAhead();
    clearTimeout(this._timeoutHandler);
    this._timeoutHandler = setTimeout(this._step.bind(this), this.timeoutPeriod)
  }

  _step() {
    const now = this._now;
    this.finished = (this._dateAhead <= now); 
  }
  
  _stop() {
    this.currentTime = this._updateCurrentTime();
    clearTimeout(this._timeoutHandler);
  }

  _reset() {
    console.log(this.currentTime, this.startTime)
    this.run = false; //User's taste: resets and stops; or only resets.
    this.currentTime = this.startTime;
    console.log(this.currentTime, this.startTime)
  }
  
}

customElements.define('a-timer-raw', ATimerRaw);

