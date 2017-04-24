# Node 4 is the current LTS release, which we use for stability, see https://github.com/nodejs/LTS/
FROM node:6

# Update the system
RUN apt-get update

RUN npm install -g serverless

RUN mkdir -p /var/www/html

# Run Serverless
EXPOSE 4000
WORKDIR /var/www/html

# Serverless-offline has changed their implementation, so need to listen on 0.0.0.0, otherwise, we can't connect.
ENTRYPOINT sls offline start --host 0.0.0.0
