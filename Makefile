.PHONY: up down clean logs logs-backend logs-frontend logs-errors logs-debug

up:
	docker compose up --build -d

down:
	docker compose down

clean:
	docker compose down --volumes --rmi local

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-errors:
	docker compose logs -f backend 2>&1 | grep -i -E "error|warning|exception"

logs-debug:
	docker compose logs -f backend 2>&1 | grep DEBUG
