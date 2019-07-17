all: 

build:
	docker build . -t eirikb/stfu

run:
	docker run --rm -it -p 2015:2015 eirikb/stfu 

push:
	docker tag eirikb/stfu eirikb.azurecr.io/stfu
	docker push eirikb.azurecr.io/stfu

login:
	docker run --rm --mount source=azureeirikb,target=/root/.azure  microsoft/azure-cli az login

restart: 
	docker run --rm --mount source=azureeirikb,target=/root/.azure  microsoft/azure-cli az container restart -g Stfu -n stfu
