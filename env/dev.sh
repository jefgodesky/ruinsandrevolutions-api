#!/bin/bash
if [ "$1" = "down" ]; then
  docker compose -f env/dev.yml down
else
  docker compose -f env/dev.yml down
  docker compose -f env/dev.yml build api
  docker compose -f env/dev.yml up -d
fi