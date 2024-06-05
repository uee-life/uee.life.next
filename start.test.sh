git checkout dev
git pull
podman-compose -p test -f docker-compose.test.yml build
podman-compose -p test -f docker-compose.test.yml up -d