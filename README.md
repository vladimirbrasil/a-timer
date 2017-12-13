[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vladimirbrasil/a-timer)
[![Build Status](https://travis-ci.org/vladimirbrasil/a-timer.svg?branch=master)](https://travis-ci.org/vladimirbrasil/a-timer)
[![Coverage Status](https://coveralls.io/repos/github/vladimirbrasil/a-timer/badge.svg?branch=master)](https://coveralls.io/github/vladimirbrasil/a-timer?branch=master)

## &lt;a-timer&gt;

## Description

`<a-timer>` is a countdown timer.
`<a-timer>` syncs duration, play and pause with animations you pass to its slot.
It's a hard battle to compete with "why not use animations alone?". 
Some of us, though, might still enjoy the confort of simply supplying animations ideas inside `<a-timer></a-timer>` and receiving a start/stop methods, or run=true/false attributes.

The proposed goal is to use minimum CPU. To be a quiet timer. 
So by now we trade the precision of the performance function for the one-event setTimeout function.

We are not olympic watches, more than we should carefully do not bother the page we're in.
Although searching for generic slotted animations to be synced is not better than to use an animation directly at your page. At this point, we trade comfort while loosing some performance.

There is not a low chance that this `a-timer` has no niche, being surpassed either by pure animations or by performant watches.

Wee'll see. 
While we wait, here `a-timer` is.

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <script src="a-timer.js"></script>
    <style>
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<a-timer start-time="60" run="true">
  <div slot="animatableTranslateX" style="height: 20px; width: 100%;">  
</a-timer>
```

## Usage

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

`<a-timer>` has slots. It lets you freely create your animation with keyframes and let the timer set only its duration and playback in sync with the timer.
[For great performance prefer to animate opacity, translate, rotate, scale.](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
```html
<a-timer>
  <div slot="animatable" style="height: 20px; width: 100%;">
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

Reset `<a-timer>` by changing `resetProp` property to true.
As you would with a traditional method, but using a property instead.
It will be reset at the instant the property changes to true.
```html
<a-timer start-time="30" reset-prop="[[reset]]"></a-timer>
```
Or use the `reset` method.
```html
<a-timer id="myTimer"></a-timer>
```
```js
this.$.myTimer.reset();
```

### Big Thanks

![Logo](images/Sauce-Labs_Horiz_Red-Grey_RGB.png)

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

### August 29th
First version.

## Credits

Vladimir Bergier Dietrichkeit

## License  

    This software is licensed under the MIT License, quoted below.

    MIT License

    Copyright (c) 2017 Vladimir Bergier

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
</content>
  <tabTrigger>readme</tabTrigger>
</snippet>