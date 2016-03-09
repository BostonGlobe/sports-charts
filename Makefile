all:
	mkdir src/charts/$(CHART)
	cp -r template/ src/charts/$(CHART)
	mkdir src/charts/$(CHART)/assets
	echo '{}' > test-data/$(CHART).json
