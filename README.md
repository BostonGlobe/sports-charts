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
`gulp prod --chart chart-name -u username`

#### All charts
If you make changes to something in **src/base** you must redeploy all charts.

*Note:* All changes must be committed before running command.

`node deploy -u username`



