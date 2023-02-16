
## Node starter
1. npm init --y
2. pnpm i -D typescript @types/node express @types/express morgan @types/morgan <!-- morgan => log -->
3. pnpm tsc --init
4. pnpm i -D @tsconfig/node-lts <!-- tsconfig bases => github -->
5. tsconfig
```json
{
  "extends": "@tsconfig/node-lts/tsconfig.json",
  "compilerOptions": {
    "lib": ["ESNext"],
    "outDir": "dist"
  },
  "include": ["src"]
}
```
6. .gitignore
7. git init
8. pnpm i -D @swc/cli @swc/core <!-- Babel alternative (https://swc.rs/) -->
9. mkdir .swcrc
```json
{
    "env": {
        "targets": {
            "node": 17
        }
    },
    "jsc": {
        "parser": {
            "syntax": "typescript"
        }
    },
    "module": {
        "type": "commonjs"
    },
    "sourceMaps": "inline"
}
```
10. pnpm i -D rimraf <!-- rm -rf [file name] -->
11. package.json
```json
{
  "scripts": {
    "build": "rimraf dist && swc ./src -d dist"
  },
}
```
12. pnpm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser <!-- ESLint -->
13. npx eslint --init
14. or this config
```json
{
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ]
}
```
## Docker
1. run docker desktop
2. docker compose up
3. docker compose restart [container name] on each change

### dockerfile
to handle Node image

```yml
# node:18-alpine3.17 ==> cause we want to use prisma and swc, we need to the full node image
FROM node:18

WORKDIR /usr/src/app

# cause our source files are going to change a lot, we want to cache our deps --- wildcard (*) for add the conditions if they exist
COPY package.json pnpm-lock.yaml *yarn.lock *package-lock.json ./
RUN npm install

# Prisma
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

# copy everything except the files inside the .dockerignore
COPY . .

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]
```

### docker compose
to handle multiple services like DB, etc

```yml
version: '3'

services:
  backend: # --- Node service ---
    build: .
    ports:
      - 8000:8000 # inside docker port:local machine port (PC)
      - 9229:9229 # debugger port
    volumes:
      - .:/usr/src/app # map the current project directory to /usr/src/app directory inside the docker
      - /usr/src/app/node_modules
    command: yarn start:docker
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgres://postgres@postgres/webapp_dev # url for connect to db - @[service name]/[db name]
      - PORT=8000
  postgres: # --- DB service ---
    image: postgres:15-alpine
    ports:
      - 5432:5432
    environment:
      - POSTGRES_DB=webapp_dev # db name
      - POSTGRES_HOST_AUTH_METHOD=trust
```

### docker command
1. docker compose up -d [container or service] <!-- start our container in detach mode ==> means we can still use current terminal after running -->
2. docker compose ps <!-- show all container -->
3. docker compose restart [container name] <!-- to restart a specific container -->
4. docker compose exec [container or service] [any command related to this service]
5. docker compose build [container or service] <!-- rebuild our Dockerfile -->
6. docker compose rm --stop [container or service] <!-- stop our container -->

## Postgres
relational db

- fast db connect check
```json
{
  "db:console": "docker compose exec postgres psql -h localhost -U postgres -d webapp_dev"
}
```

### db command
1. \d <!-- show all tables -->
2. \q <!-- exit -->

## Prisma
ORM to connect the backend to the db

1. pnpm i -D prisma
2. pnpx prisma init
3. delete `.env` => cause we are using docker
4. after create schema ==> npx prisma generate
5. after that, we have @prisma/client to find all the types for our client side

## Other Deps
1. install `trigger task on save` extension
2. add `extensions`, `launch`, `settings`, and `tasks` .json to each project for docker and debbugging