## &lt;a-timer&gt;

## Description

`<a-timer>` is a countdown timer.

## Installation

Just install as any webcomponent. No external dependencies beyond polymer.

## Usage

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

The 2-Clause BSD License

Copyright 2017 Vladimir Bergier Dietrichkeit

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
</content>
  <tabTrigger>readme</tabTrigger>
</snippet>