# Notes

## Testing

### Setup

gem install travis

travis encrypt SAUCE_USERNAME={{username}} --add

travis encrypt SAUCE_ACCESS_KEY={{go to https://saucelabs.com/beta/user-settings}} --add

vai adicionar duas linhas 'env >> global > secure' em travis.yml (apagar as anteriores)

### Browsers

On december 3<sup>rd</sup>, 2017.

| Passing       | Not passing   |
|:------------- |:--------------|
| Safari      	| Edge 			|
| Chrome      	| IE      		|
| Firefox 		|       		|

[Choose browsers to test on sauce](https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/) and add them to  **wct.conf.json**

**wct.conf.json**
```javascript
      "browsers": [
        {
          "browserName": "MicrosoftEdge",
          "platform": "Windows 10",
          "version": ""
        }, {
          "browserName": "internet explorer",
          "platform": "Windows 8.1",
          "version": "11.0"
        },
        {
          "browserName": "safari",
          "platform": "OS X 10.11",
          "version": "10.0"
        }
      ]
```

After each push, watch test results at [travis](https://travis-ci.org/vladimirbrasil/a-timer).

This [video](https://www.youtube.com/watch?v=afy_EEq_4Go) is the great resource for configuration. 

Testing with polymer [help page](https://www.polymer-project.org/2.0/docs/tools/tests).

### Timezone

Date and time tests rely on a known timezone for proper evaluation. 

**travis.yml**
```
before_install:
- export TZ=America/Sao_Paulo
```
The above code is needed at **travis.yml** file for tests to evaluate results properly.

## Known issues

# Todos