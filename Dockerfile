FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install GYP dependencies globally, will be used to code build other dependencies
RUN npm install -g --production node-gyp \
    && npm install -g --production node-pre-gyp \ 
    && npm cache clean --force


# Install dependencies
COPY package.json .
RUN npm install \
    && npm cache clean --force

# Bundle app source
COPY . /usr/src/app


CMD [ "node", "index.js" ]