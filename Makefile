default: help

.PHONY: help

help: # Show help for each of the Makefile recipes.
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\nmake \033[1;32m$$(echo $$l | cut -f 1 -d':') \033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

gmod: # nest генерирует (module, controller, service)
	npx nest g module util/cache-module-config
	npx nest g controller util/cache-module-config
	npx nest g service util/cache-module-config
start: #docker круто когда сохраняете код он перезагружает js server
	docker compose up --build