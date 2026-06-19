# Variables
COMPOSE_FILE = ./docker-compose.yml

MAKE = make -j

# Rules
all:
	docker network create public-network || true
	./start.sh
status:
	docker ps -a

stop:
	docker compose -f $(COMPOSE_FILE) stop

down:
	docker compose -f $(COMPOSE_FILE) down
	docker network rm public-network || true