# Sports charts

## How to make new chart
`make CHART=chart-name`

This creates a new directory **src/charts/chart-name** where all code should be placed. It also creates a new testing data file **test-data/chart-name.json**.

## Development
Start local server: `gulp --chart chart-name`
See more [detailed instructions](#detailed-instructions).

## Deploy
#### Single chart
`gulp prod --chart chart-name -u username`

#### All charts
If you make changes to something in **src/base** you must redeploy all charts.

*Note:* All changes must be committed before running command.

`node deploy -u username`

## Fonts
Available fonts:
* Benton regular ('benton-regular')
* Benton bold ('benton-bold')
* Benton condensed regular ('benton-cond-regular')
* Benton compressed regular ('benton-comp-regular')

#### Usage
```html
<p class='benton-regular'>I love the sports ball.</p>
```

## Detailed instructions
* HTML that applies to all charts (eg. header) is **src/base/index.html**.
* Any js modules you create that could be useful to other charts should be placed in **src/utils**.
* Same goes for css, but located at **src/base/css**. This is the place for variables and mixins as well.
* The chart relies on two libraries outside of the iframe, [pym.js](https://github.com/nprapps/pym.js) and [enter-view](https://github.com/russellgoldenberg/enter-view).
* Changes to the parent html page for development should be made to **preview.html.template**.
