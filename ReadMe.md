Running MathJax in Serverless environment.

# Tools Required
- node 6.1
- nvm ([Node Version Manager](https://github.com/creationix/nvm))
- Serverless (https://www.npmjs.com/package/serverless)
- Docker
- Facebook Yarn

# Installation
- Build docker image:

`docker-compose build`

- Install package

`nvm use && npm install && cd functions && yarn`

Note: `nvm use` will automatically switch your node environment to node 6.10

- Start docker:

`docker-compose up`


# Deployment

Using the following command:

`sls deploy --stage [stage] --region [region]`, replace [stage] and [region] values with your choices.

## Staging

`sls deploy --stage staging --region us-west-2`

## Production

`sls deploy --stage prod --region ap-southeast-2`

## Notes:

The URL given at the end of deployment is the API Gateway URL you need to define in web and worker environment.