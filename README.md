# LiveTones (aka Node.js PWA)
A progressive web app built using the expressjs and node.js frameworks that makes use of a local database and remote database. Also includes webpage caching, syncing between local and remote database services via Socket.IO and WebRTC for live image uploads.

The following folders contain the program files:

* ***IntelligentWeb/solution*** - source code
* ***IntelligentWeb/report*** - requirements, planning
* ***IntelligentWeb/screenshots*** - screenshots or video of the application

Start chrome with these flags to avoid SSL errors:

```
chrome --test-type --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:3000
```

## Instructions

1. Start MongoDB

```
sudo service mongodb start
```

2. Run npm

```
npm start
```

3. Run Sass

```
npm run sass
```

4. Run the production env

```
npm production
```

5. Finally run the application