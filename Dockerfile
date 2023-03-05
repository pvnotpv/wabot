FROM node:14-alpine

RUN apk update && apk upgrade \
    && apk add --no-cache bash chromium ffmpeg git yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
    
WORKDIR /app
COPY . /app
RUN yarn -add
CMD node index.js
