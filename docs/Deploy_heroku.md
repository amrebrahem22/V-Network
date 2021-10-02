# Deploy Heroku

- in the main folder run 
```bash
npm i concurrently
```

- now go to `package.json` and add these scripts
```json
"scripts": {
    "start": "node server.js",
    "server": "nodemon server.js",
    "client": "cd client && npm run start",
    "server-install": "npm install",
    "client-install": "cd client && npm install",
    "install-all": "concurrently \"npm run server-install\" \"npm run client-install\" ",
    "dev": "concurrently \"npm run server\" \"npm run client\" ",
    "heroku-postbuild": "cd client && npm install && npm run build"
}
```
- and in `server.js` add the path to the build directory
```js
const path = require('path')

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}
```

- now go to `Heroku` and create app
- navigate to `deploy`
- and run in CMD
```bash
heroku login
```
- initialize git
```bash
git init

git add .
```
- then run 
```bash
heroku git:remote -a the-app-name
```
- then commit & push
```bash
git commit -m "make it better"

git push heroku master
```
- then in the heroku app navigate to the `Access` page in the navbar, and copy all enviroment variables in `.env` file and create eniroment variables in the this tab

- now go to `client/src/utils/config.js` and update the base path
```js
export const BASE_URL = 'https://v-network-devat.herokuapp.com'
```

- then add the files and push to heroku master

