#!/bin/bash

cd /home/ubuntu/Travel_Tales_frontend
git pull origin develop

cd /home/ubuntu/Travel_Tales_backend
git pull origin develop

docker system prune -a -f
docker-compose build --no-cache