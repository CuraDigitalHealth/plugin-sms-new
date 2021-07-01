FROM node:8-alpine
RUN mkdir -p /usr/src/example
COPY . /usr/src/example
WORKDIR /usr/src/example
RUN yarn
EXPOSE 5001
CMD [ "npm", "run prod" ]