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
    }
  </style>
  <div id="clickableArea">  
    <slot id="animatable" name="animatable"></slot>
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
    this.shadowRoot.querySelector('#clickableArea').addEventListener('click', this._clickableAreaClicked.bind(this));
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
    this.run = false;
    this.setAttribute('current-time', valueOrDefault);
    this.setAttribute('start-time', valueOrDefault);
    this._restartCssAnimations();
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


      this.dispatchEvent(new CustomEvent('finish'), {detail: currentTime});

      // console.log(`currentTime before pause: ${this.currentTime}`);
      if (this.run) this.run = false;
      // console.log(`currentTime after pause: ${this.currentTime}`);
      // console.log('oi2', this.currentTime)
    }
    else
      this.removeAttribute('finished');
  }
  get finished() {
    return this.hasAttribute('finished');
  }

  /**
  * Sinalizes if slot has animations.
  */
  set hasAnimations(value) {
    if (this._animatedElements && this._animatedElements.length > 0) {
      this.setAttribute('has-animations', '');
    } else {
      this.removeAttribute('has-animations');
    }
  }
  get hasAnimations() {
    return this.hasAttribute('has-animations');
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
    if(this.hasAnimations) this._startCssAnimations();

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
    // console.log(`this._dateAhead: ${this._dateAhead}`)
    // console.log(`this._now: ${this._now}`)
    return (this._dateAhead <= this._now);
  }

  _stop() {
    if(this.hasAnimations) this._pauseCssAnimations();

    this.currentTime = this._updateCurrentTime();
    clearTimeout(this._timeoutHandler);
    clearInterval(this.refreshRateTimer);
  }

  _reset() {
    if (this.hasAnimations) this._restartCssAnimations();

    this.run = false; // User's taste: resets and stops; or only resets.
    this.currentTime = this.startTime;
  }


  /**
  * Animation
  */
  _restartCssAnimations() {
    // console.log('restarted', this.getAttribute('start-time'));
    if (!this._animatedElements) return;
    this._animatedElements.forEach((animatedEl) => {
      this._restartElementCssAnimation(animatedEl);
    });
  }

  _restartElementCssAnimation(animatedEl) {
    // http://jsfiddle.net/leaverou/xK6sa/2/
    // restart animation
    var me = animatedEl;
    // const memAnimation = animatedEl.style.webkitAnimation;
    // console.log(`memAnimation: ${memAnimation}`);
    animatedEl.style.webkitAnimation = 'none';
    setTimeout(() => {
      this._setStyle(me, 'animation', '-webkit-animation', '');
      // this._setStyle(me, 'animation', '-webkit-animation', memAnimation);
      // me.style.webkitAnimation = memAnimation;
      this._setElementCssAnimation(me);
    }, 10);


    // var elm = animatedEl;
    // elm.offsetWidth = elm.offsetWidth;
    // void elm.offsetWidth;
    // var newone = elm.cloneNode(true);
    // this._pauseElementCssAnimation(newone);
    // console.log('elm.parentNode: ', elm.parentNode)
    // console.log('elm: ', elm)
    // elm.parentNode.replaceChild(newone, elm);
  }

  _setElementCssAnimation(animatedEl) {
    // animatedEl.style["-webkit-animation-name"] = 'rota';
    this._setStyle(animatedEl, 'animationPlayState', '-webkit-animation-play-state', 'paused');
    this._setStyle(animatedEl, 'animationIterationCount', '-webkit-animation-iteration-count', '1');
    this._setStyle(animatedEl, 'animationDuration', '-webkit-animation-duration', `${this.startTime}s`);
    // animatedEl.style["-webkit-animation-play-state"] = 'paused';
    // animatedEl.style["-webkit-animation-iteration-count"] = `1`;
    // animatedEl.style["-webkit-animation-duration"] = `${this.startTime}s`;
    // console.log('animatedEl: ', animatedEl);
    // console.log(animatedEl.style["-webkit-animation-name"]);
    // console.log(animatedEl.style["-webkit-animation-iteration-count"]);
    // console.log(animatedEl.style["-webkit-animation-duration"]);
    // console.log(animatedEl.style["-webkit-animation-play-state"]);

    const animationEventName = whichAnimationEventName();
    animatedEl.addEventListener(animationEventName, this._cssAnimationEnded.bind(this));

    function whichAnimationEventName(){
      var t,
          el = document.createElement("fakeelement");
    
      var animations = {
        "animation"      : "animationend",
        "OAnimation"     : "oAnimationEnd",
        "MozAnimation"   : "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
      }
    
      for (t in animations){
        if (el.style[t] !== undefined){
          return animations[t];
        }
      }
    }    
  }

  _cssAnimationEnded(e) {
    // console.log('css animations ended event', e);
  }

  _startCssAnimations() {
    if (!this._animatedElements) return;
    this._animatedElements.forEach((animatedEl) => {
      this._startElementCssAnimation(animatedEl);
    });
  }

  _pauseCssAnimations() {
    if (!this._animatedElements) return;
    this._animatedElements.forEach((animatedEl) => {
      this._pauseElementCssAnimation(animatedEl);
    });
  }

  _startElementCssAnimation(animatedEl) {
    this._setStyle(animatedEl, 'animationPlayState', '-webkit-animation-play-state', 'running');    
    // animatedEl.style['-webkit-animation-play-state'] = 'running';
  }
  
  _pauseElementCssAnimation(animatedEl) {
    this._setStyle(animatedEl, 'animationPlayState', '-webkit-animation-play-state', 'paused');    
    // animatedEl.style['-webkit-animation-play-state'] = 'paused';
  }

  _clickableAreaClicked(e) {
    // console.log(e)
    // console.log('animation clicked');
    this.run = !this.run;
    // this._animatable.animationPlayState = "paused";
  }




  /**
  * Slots
  */
  _connectSlots() {
    this._animatable = this._getElementFromSlot('#animatable');
    if (!this._animatable) return;
    // console.log(`this._animatable: ${this._animatable}`);
    
    var allElements = Array.from(this._animatable.getElementsByTagName('*'));
    allElements.push(this._animatable); // We must not forget the parent itself
    // console.log(`allElements: ${allElements}`);
    let animatedElements = [];
    for (var i=0, max=allElements.length; i < max; i++) {
      const el = allElements[i];
      const animationName = this._getStyle(el, 'animationName', '-webkit-animation-name');
      // const animationDuration = getStyle(el, "animationDuration", "-webkit-animation-duration");
      // console.log(animationDuration)
      // console.log(`animationName: ${animationName}`);
      if (animationName != 'none') animatedElements.push(el);
    }
    this._animatedElements = animatedElements;
    // console.log('animated elements: ', animatedElements);
    this.hasAnimations = 'anyvalue-it-will-detect-internally';
    // if (this._animatedElements.length > 0) {
    // } else {
    //   this.removeAttribute('has-animations');
    // }
    // this.hasAnimations = this.getAttribute('has-animations');
    // console.log(this.hasAnimations);
    if (this.hasAnimations) this._restartCssAnimations();
    return;
  }
  
  _getElementFromSlot(querySelector) {
    var slotElement = this.shadowRoot.querySelector(`${querySelector}`);
    // console.log(slotElement);
    if (!slotElement) return;
    const actualElement = slotElement.assignedNodes({flatten: true})
      .find((n) => n != null);
    // console.log(actualElement);
    return actualElement;
  }

  _getStyle(elem, cssprop, cssprop2) {
    // IE
    if (elem.currentStyle) {
      return elem.currentStyle[cssprop];

    // other browsers
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
      return document.defaultView.getComputedStyle(elem, null).getPropertyValue(cssprop2);

    // fallback
    } else {
      return null;
    }
  }
  _setStyle(elem, cssprop, cssprop2, value) {
    // IE
    if (elem.currentStyle) {
      elem.currentStyle[cssprop] = value;
      return;

    // other browsers
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
      elem.style.setProperty(cssprop2, value);
      return;

    // fallback
    } else {
      return null;
    }
  }

}

customElements.define('a-timer', ATimer);

