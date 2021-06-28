FROM node:12.8.1

# Create application directory
WORKDIR /usr/src/app

# Install application dependencies
COPY /package*.json ./

RUN npm install

# Bundle app source
COPY /. .

EXPOSE 4004

CMD [ "npm", "start" ]
