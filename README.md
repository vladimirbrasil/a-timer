## &lt;a-timer&gt;

## Description

`<a-timer>` is a countdown timer.

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
<a-timer start-at="30" current-time="{{currentTime}}" on-finish="finish"></a-timer>
[[currentTime]]
```

## Installation

To use the element:

`bower install a-timer`

## Usage

`<a-timer>` may easily be attached to graphic elements.
```html
<a-timer start-at="30" current-time="{{currentTime}}"></a-timer>
[[currentTime]]
```

It may include one more optional alert.

```html
<a-timer start-at="30" alert-at="10" on-alert="oneMoreAlert" on-finish="finish"></a-timer>
```

It may alert periodically.

```html
<a-timer start-at="30" alert-every="1" on-tick="tick" on-finish="finish"></a-timer>
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