all:
	mkdir src/charts/$(CHART)
	cp template/**/* src/charts/$(CHART)
	cp template/index.html src/charts/$(CHART)