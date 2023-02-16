# node:18-alpine3.17 ==> cause we want to use prisma and swc, we need to the full node image
FROM node:18

WORKDIR /usr/src/app

# cause our source files are going to change a lot, we want to cache our deps --- wildcard (*) for add the conditions if they exist
COPY package.json pnpm-lock.yaml *yarn.lock *package-lock.json ./
RUN npm install

# copy everything except the files inside the .dockerignore
COPY . .

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]

