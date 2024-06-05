git checkout dev
git pull
sudo docker-compose -p test -f docker-compose.test.yml build
sudo docker-compose -p test -f docker-compose.test.yml up -d