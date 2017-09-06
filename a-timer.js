/*
`<a-timer>` is a countdown timer. It is capable to be driven by attributes only, as you wish.

```html
<a-timer start-time="30"></a-timer>
```

You can observe changes to the `[[finished]]` attribute or to the `finish` event. 
Suit yourself. 
```html
<a-timer finished="{{finished}}"></a-timer>
<a-timer on-finish="timerFinished"></a-timer>
```

`<a-timer>` may easily be attached to graphic elements.
```html
<a-timer current-time="{{currentTime}}"></a-timer>
[[currentTime]]
```

It's up to you to define `refresh-rate` (in milliseconds) to update currentTime periodically. 
By default `current-time` is updated only on finish and whenever you ask for its value.
```html
<a-timer refresh-rate="200" current-time="{{currentTime}}"></a-timer>
[[currentTime]]
```

Start/stop `<a-timer>` by changing `run` property to true/false.
```html
<a-timer start-time="30" run="[[run]]"></a-timer>
```
Or use the `start`/`stop` methods.
```html
<a-timer id="myTimer"></a-timer>
```
```js
this.$.myTimer.start();
this.$.myTimer.stop();
```

@element a-timer
@hero hero.svg
@demo demo/index.html
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

class ATimer extends HTMLElement {
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
    const val = value || this.startTime;
    this.lastCurrentTime = this.getAttribute('current-time');
    this.setAttribute('current-time', this._nonNegative(val));
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
    // console.log(this.currentTime, now/1000, this._dateAhead/1000);    
  }

  _nonNegative(value) {
    return (value < 0) ? 0 : value;
  }

  /**
  * Current time.
  */
  set lastCurrentTime(value) {
    const val = value || this.currentTime;
    this.setAttribute('last-current-time', this._nonNegative(val));
  }
  get lastCurrentTime() {
    // console.log('oiii', this.getAttribute('last-current-time'))
    return this.getAttribute('last-current-time');
  }

  /**
  * Refresh rate (milliseconds) to periodically update current-time.
  */
  set refreshRate(value) {
    // if (value < 5 || value > this.startTime*1000) return; 
    this.setAttribute('refresh-rate', value);
  }
  get refreshRate() {
    return this.getAttribute('refresh-rate');
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
      this._stop();
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
      this.setAttribute('finished', '');
      this.resetProp = true;
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
    if (this.finished) this.finished = false;
    clearTimeout(this._timeoutHandler);
    this._timeoutHandler = setTimeout(this._step.bind(this), this.timeoutPeriod);

    if (this.refreshRate) {
      clearInterval(this.refreshRateTimer);
      this.refreshRateTimer = setInterval(this._step.bind(this), this.refreshRate);
    }
  }

  _step() {
    const now = this._now;
    this.currentTime;
    this.finished = (this._dateAhead <= now); 
  }
  
  _stop() {
    this.currentTime = this._updateCurrentTime();
    clearTimeout(this._timeoutHandler);
    clearInterval(this.refreshRateTimer);
  }

  _reset() {
    this.run = false; //User's taste: resets and stops; or only resets.
    this.currentTime = this.startTime;
  }
  
}

customElements.define('a-timer', ATimer);

