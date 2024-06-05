git checkout develop
git pull
sudo docker-compose -p test -f docker-compose.test.yml build
sudo docker-compose -p test -f docker-compose.test.yml up -d