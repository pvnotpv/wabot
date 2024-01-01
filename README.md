Not your average whatsapp bot. 

# Wabot-3.7.0

All images are fetched from reddit and cached in-memory every 5 minutes.

<p float="left">
  <img src="https://github.com/pvnotpv/wabot/blob/main/imgs/1.gif?raw=true" width="250" />
  <img src="https://github.com/pvnotpv/wabot/blob/main/imgs/2.gif?raw=true" width="250" />
   <img src="https://github.com/pvnotpv/wabot/blob/main/imgs/3.gif?raw=true" width="250" />
</p>

<p float="left">
  <img src="https://github.com/pvnotpv/wabot/blob/main/imgs/5.jpg?raw=true" width="250" />
</p>
(gifs may take a bit to load.)

## AND MUCH MORE !!!

## MISC

- Uses mongodb as primary db and redis(even for images) to cache, so the bot is pretty fast.
- NSFW commands can be enabled/disabled by admins.
- You won't be banned from WhatsApp unless you make the bot public, Just add the bot to your friends/family groups but nothing else.
- You can host the bot for free on Railway, 500 hours per month free. 

## SETUP

- Clone the repo 
- Edit the .env file.
- Watch a video on youtube to setup mongodb and change the db url.
- There are tons of guides on google to setup Snoowrap for reddit.

### Docker file method
- Make sure to run the redis docker image.
- docker build -t wabot .
- docker run -p 8080:8080 wabot

### Manual
- yarn --add to install dependencies.
- You need to have redis-server running on localhost.
- yarn run start
- Visit localhost:8080/qrcode, scan the qr and you're pretty good to go.

## APIS USED

- Insult Api - https://insult.mattbas.org/api/
- Mom jokes - https://yomomma.info/
- Snoowrap for reddit - https://not-an-aardvark.github.io/snoowrap
- Whatsapp-web.js - https://wwebjs.dev/
