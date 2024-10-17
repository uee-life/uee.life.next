git checkout main
git pull
podman-compose -p live -f docker-compose.test.yml down
podman-compose -p live -f docker-compose.test.yml build
podman-compose -p live -f docker-compose.test.yml up -d