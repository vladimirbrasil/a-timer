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

`<a-timer>` has slots. It can animate, in sync with timer, some animatable elements passed to it. For now, you can pass elements to its `animatableTranslateX` or `animatableRotate` slots.
In the future it should be possible to let you freely create your animation with keyframes and let the timer set only its duration and playback in sync with the timer. This is not ready yet, unfotunately. 
[For great performance prefer to animate opacity, translate, rotate, scale](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
```html
<a-timer>
  <div slot="animatableTranslateX" style="height: 20px; width: 100%;">
</a-timer>
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
      --start-color: green;
      --alert-color: yellow;
      --end-color: red;
      --background-color: #ddd;
    }
    /* ::slotted(.foo) { */
    ::slotted(*) {
      margin: 0 !important;
      color: var(--end-color);
      background-color: currentColor !important;
    }
    #clickableArea {
      overflow: hidden;
      min-height: 10px;
      min-width: 10px;
      background: var(--background-color);
    }
  </style>
  <div id="clickableArea">  
    <slot id="animatableTranslateXId" name="animatableTranslateX"></slot>
    <slot id="animatableRotateId" name="animatableRotate"></slot>
  </div>
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
    return ['start-time', 'current-time', 'refresh-rate', 'run', 'resetProp', 'finished'];
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
    this._connectSlots();
    if (!this.hasAttribute('start-time'))
      this.setAttribute('start-time', 30);
    if (!this.hasAttribute('current-time'))
      this.setAttribute('current-time', this.startTime);
    this.removeAttribute('run');
    this.removeAttribute('resetProp');
    this.shadowRoot.querySelector('#clickableArea').addEventListener('click', this._animationClick.bind(this));
    
  }

  disconnectedCallback() {
    clearInterval(this.int);
  }

  /**
  * Start time.
  */
  set startTime(value) {
    if (value <= this.currentTime) this.currentTime = value;
    const valueOrDefault = value || 30;
    this.setAttribute('start-time', valueOrDefault);
    this._setAnimation();
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
    const internalValue = this._iAmFinished();
    const wasFinished = this.finished;
    const isFinished = Boolean(internalValue);
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
    // if (this._rotateAnimation) this._rotateAnimation.play();
    // if (this._animatable && this._animatable.style.animationPlayState != 'running') this._animatable.style.animationPlayState = 'running';    
    if (this._animation) this._animation.play();    
    
    if (this.finished) this.finished = false;
    clearTimeout(this._timeoutHandler);
    this._timeoutHandler = setTimeout(this._step.bind(this), this.timeoutPeriod);

    if (this.refreshRate) {
      clearInterval(this.refreshRateTimer);
      this.refreshRateTimer = setInterval(this._step.bind(this), this.refreshRate);
    }
  }

  _step() {
    this.currentTime;
    this.finished = this._iAmFinished();
  }

  _iAmFinished() {
    return (this._dateAhead <= this._now);
  }
  
  _stop() {
    // if (this._rotateAnimation) this._rotateAnimation.pause();
    // if (this._animatable && this._animatable.style.animationPlayState != 'paused') this._animatable.style.animationPlayState = 'paused';    
    if (this._animatable) this._logAnimationPerformance();
    if (this._animation) this._animation.pause();    
    
    this.currentTime = this._updateCurrentTime();
    clearTimeout(this._timeoutHandler);
    clearInterval(this.refreshRateTimer);
  }

  _logAnimationPerformance() {
    if (this._animatableRotate) {
      this.currentTime;
      //TODO: [when stopped, ] currentTime returns actually lastCurrentTime.
      const currentRotation360 = this._getCurrentRotation();
      const animCurrentTime = this.startTime * (currentRotation360/360);
      // const animCurrentTime = this._rotateAnimation.currentTime / 1000;
      console.log(`animation currentTime: ${this.startTime - animCurrentTime}`);
      console.log(`animation currentRotation: ${currentRotation360}`);
      // console.log(`timer versus animation time diff: ${currentTime - animCurrentTime}`);
    }
  }

  _reset() {
    // if (this._rotateAnimation) this._rotateAnimation.cancel();

    if (this._animatable) {
      this._resetAnimation();
    };
    
    this.run = false; //User's taste: resets and stops; or only resets.
    this.currentTime = this.startTime;
  }

  
  /**
  * Animation
  */
  _setAnimation() {
    if (!this._animatableTranslateX && !this._animatableRotate) return;
    this._resetAnimation();

    let transforms = null;

    if (this._animatableTranslateX) {
      this._animatable = this._animatableTranslateX;
      transforms = {start: 'translateX(-100%)', end: 'translateX(0)'};
    } else if (this._animatableRotate) {
      this._animatable = this._animatableRotate;
      transforms = {start: 'rotate(0deg)', end: 'rotate(360deg)'};
    } else {
      this._animatable = null;
      return;
    }

    if (!transforms) return;
    var animationTransformation = [
      { transform: transforms.start, color: 'var(--start-color)' },
      { color: 'var(--alert-color)', offset: 0.6667},
      { transform: transforms.end, color: 'var(--end-color)' }
    ];
    var animationDuration = {
      duration: this.startTime * 1000,
      iterations: 1,
    }
  
    const animatable = this._animatable;

    const animation = animatable.animate(
      animationTransformation, 
      animationDuration,
    );
    // https://www.polymer-project.org/2.0/docs/devguide/gesture-events
    // animation.onstart = this._animationStart.bind(this);
    animation.pause();
    animation.onfinish = this._animationEnd.bind(this);
    animation.oncancel = this._animationCancel.bind(this);

    this._animation = animation;
  }

  _animationClick(e) {
    // console.log(e)    
    // console.log('animation clicked');
    this.run = !this.run;
    // this._animatable.animationPlayState = "paused";
  }
  
  _animationEnd(e) {
    console.log(e)    
    console.log('animation ended');
    this._animatable.animationPlayState = "paused";
  }
  
  _animationCancel(e) {
    console.log(e)    
    console.log('animation cancelled');
    // this._animatable.animationPlayState = "paused";
  }
  
  _animationStart(e) {
    console.log(e)    
    console.log('animation started');
  }

  _resetAnimation() {
    if (!this._animation) return;
    this._animation.cancel();

    // // https://css-tricks.com/restart-css-animation/
    // const element = this._animatable;
    // element.classList.remove("animation");
    // void element.offsetWidth;
    // element.classList.add("animation");
    // console.log(element.classList)
    // return;

    // console.log(this._animatable);
    // if (!this._animatable) return;
    
    // // https://css-tricks.com/restart-css-animation/
    // var elm = this._animatable;
    // var newone = elm.cloneNode(true);
    // elm.parentNode.replaceChild(newone, elm);
    // this._animatable = newone;      
    // this._animatable.addEventListener('webkitAnimationEnd', this._animationEnd.bind(this));
    // this._animatable.addEventListener('webkitAnimationStart', this._animationStart.bind(this));

    // console.log(`animation: ${this._animatable.style.animation}`)
    // console.log(this._animatable.style)
    // this._animatable.style.animation = '';

  }

  /**
  * Slots
  */
  _connectSlots() {
    this._animatableTranslateX = this._getElementFromSlot('#animatableTranslateXId');
    this._animatableRotate = this._getElementFromSlot('#animatableRotateId');
    this._setAnimation();
  }
  _getElementFromSlot(querySelector) {
    var slotElement = this.shadowRoot.querySelector(`${querySelector}`);
    // console.log(slotElement);
    if (!slotElement) return;
    const actualElements = slotElement.assignedNodes({flatten: true});
    for (var i = 0; i < actualElements.length; i++) {
      var element = actualElements[i];
      if (element != null) return element;      
    }
      // .find(n => n != null); //for loop is IE11 compatible
    // console.log(actualElement);
    // return actualElement;
  }
  
  _slotPlayPause() {
    this.run = !this.run;
  }
  _slotPlay() {
    this.run = true;
  }
  _slotPause() {
    this.run = false;
  }
  _slotReset() {
    this.resetProp = true;
    // this._rotateAnimation.playbackRate = 3;
  }

  _getCurrentRotation() {
    // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    var el = this._animatableRotate;
    if (!el) return null;
    var st = window.getComputedStyle(el, null);
    var tr =  st.getPropertyValue("-webkit-transform") ||
              st.getPropertyValue("-moz-transform") ||
              st.getPropertyValue("-ms-transform") ||
              st.getPropertyValue("-o-transform") ||
              st.getPropertyValue("transform") ||
              "Either no transform set, or browser doesn't do getComputedStyle";
    
    // rotate(Xdeg) = matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0);
    const currentRotation = matrixToDegrees(tr);
    const currentRotation360 = currentRotation > 0 ? currentRotation : (360 + currentRotation);
  
    return currentRotation360;          

    function matrixToDegrees(tr) {
      if (!tr || tr == 'none') return null;
      // With rotate(30deg)...
      // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
      // console.log('Matrix: ' + tr);


      // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

      var values = tr.split('(')[1];
          values = values.split(')')[0];
          values = values.split(',');
      var a = values[0];
      var b = values[1];
      var c = values[2];
      var d = values[3];

      var scale = Math.sqrt(a*a + b*b);

      // arc sin, convert from radians to degrees, round
      // DO NOT USE: see update below
      var sin = b/scale;
      // var angle = Math.round(Math.asin(sin) * (180/Math.PI));
      var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

      // works!
      // console.log('Rotate: ' + angle + 'deg');
      return angle;
    }

  }  

}

customElements.define('a-timer', ATimer);

