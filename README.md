# Sports charts

## How to make new chart
`make CHART=chart-name`

* This creates a new directory (**src/charts/chart-name**) where all code should be placed.
* It also creates a new testing data file (**test-data/chart-name.json**). Put your sample data here.
* Any js modules you create that could be useful to other charts should be placed in **src/utils**.

## Development
* Start local server: `gulp --chart chart-name`

## Deploy 
#### Single chart
`gulp prod --chart chart-name`

#### All charts
If you make changes to something in base (chart-base.css or index.html) you must redeploy all charts:

`npm run deploy` (TBD)



