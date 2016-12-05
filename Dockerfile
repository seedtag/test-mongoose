FROM node:6

WORKDIR /code

ADD package.json /code

RUN npm install

ADD src /code/src

CMD ["npm", "run", "start"]
