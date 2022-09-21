# rc-utils-api

## Getting started
```shell
npm install
npm run build
npm start
```

## Setting up database
The application requires a mongodb. You can use your own mongodb or start a new instance via docker-compose
```shell
npm run docker:database:start
```

## Configuration
The configuration is loaded from environment variables. You can also provide a `.env` file in the project root.

| Variable       | Description                              |
|----------------|------------------------------------------|
| MONGODB_URI    | connection uri for your mongodb instance |
| DISCORD_TOKEN  | discord api application token            |
| GUILD_ID       | discord guild id                         |
| APPLICATION_ID | discord application id                   |
| WCL_GUILDID    | warcraftlogs guild id                    |   
| WCL_USERNAME   | warcraftlogs username                    |   
| WCL_PASSWORD   | warcraftlogs password                    |   

