## &lt;a-timer&gt;

## Description

`<a-timer>` is a countdown timer unusually capable to be driven by properties only.

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="a-timer.html">
    <style>
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<a-timer start-at="30"></a-timer>
<a-timer start-at="30" current-time="{{currentTime}}" signalFinish="{{finish}}"></a-timer>
```

## Usage

```html
<a-timer start-at="30"></a-timer>
```

'Events' are signaled setting correspondingly property to true. 
And then to false again after the second passes. 

```html
<a-timer start-at="30" signalFinish="{{finish}}"></a-timer>
```

You can observe changes to [[finish]], acting when it is set to true, 
as you would with an traditionally fired event.

`<a-timer>` may easily be attached to graphic elements.

```html
<a-timer start-at="30" current-time="{{currentTime}}"></a-timer>
[[currentTime]]
```

Start/stop `<a-timer>` by changing ```run``` property to true/false.
As you would with a traditional method, but using a property instead.

```html
<a-timer start-at="30" run="[[run]]"></a-timer>
```

Reset `<a-timer>` by changing ```reset``` property to true.
As you would with a traditional method, but using a property instead.
It will be reset at the instant the property changes to true.

```html
<a-timer start-at="30" reset="[[reset]]"></a-timer>
```

It may include one more optional alert ```alert-also-at```, 
correspondingly signaled by ```signal-alert-also-at```.

```html
<a-timer 
  start-at="30" 
  alert-also-at="10" 
  signal-alert-also-at="{{signalAlertAlsoAt}}" 
  signalFinish="{{finish}}">
</a-timer>
```

It may alert periodically.

```html
<a-timer start-at="30" alert-tick="2" signal-alert-tick="{{signalAlertTick}}"></a-timer>
```
A tick is meant to be higher than 1 second. For 1 second ticks, 
you can watch changes directly on ```current-time``` property, which updates every second. 

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