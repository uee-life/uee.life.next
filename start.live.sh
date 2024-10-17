git checkout main
git pull
podman-compose -p live -f docker-compose.live.yml down
podman-compose -p live -f docker-compose.live.yml build
podman-compose -p live -f docker-compose.live.yml up -d