all: build push

build:
	docker build . -t eirikb/stfu

push:
	docker tag eirikb/stfu eirikb.azurecr.io/stfu
	docker push eirikb.azurecr.io/stfu
