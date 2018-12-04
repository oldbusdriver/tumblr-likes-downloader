# HOWTO
- Use this program need use your OAuth infomation, please go to !(page)[https://www.tumblr.com/docs/en/api/v2#auth] to get it and paste them in main.js(L32-L35).
- Then `yarn&&yarn start`
- Basically, it will first create a data.json file which contains infomation about videos_url, title & id so it will use it latter on to download videos and to resume from if break suddently.
  - Only video will be downloaded for now. photos.json save info about photos but won't be downloaded for now.