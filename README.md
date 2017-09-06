[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vladimirbrasil/a-timer)
[![Build Status](https://travis-ci.org/vladimirbrasil/a-timer.svg?branch=master)](https://travis-ci.org/vladimirbrasil/a-timer)
[![Coverage Status](https://coveralls.io/repos/github/vladimirbrasil/a-timer/badge.svg?branch=master)](https://coveralls.io/github/vladimirbrasil/a-timer?branch=master)

## &lt;a-timer&gt;

## Description

`<a-timer>` is a countdown timer. It is capable to be driven by attributes only, as you wish.

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
<a-timer start-at="5" run="true"></a-timer>
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

    This software is licensed under the Apache 2 license, quoted below.

    Copyright 2011-2015 Collaborne B.V. <http://github.com/Collaborne/>

    Licensed under the Apache License, Version 2.0 (the "License"); you may not
    use this file except in compliance with the License. You may obtain a copy of
    the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
    License for the specific language governing permissions and limitations under
    the License.
</content>
  <tabTrigger>readme</tabTrigger>
</snippet>