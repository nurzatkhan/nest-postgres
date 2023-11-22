FROM node:20.9.0-alpine3.18 AS build
WORKDIR /ohif/app/main

COPY package.json ./
COPY package-lock.json ./
RUN  npm ci
COPY . ./
RUN npm run build

FROM node:20.9.0-alpine3.18 as main
ENV TZ=Asia/Almaty
WORKDIR /ohif/app/main

COPY --from=build /ohif/app/main/package.json /ohif/app/main/package.json
COPY --from=build /ohif/app/main/tsconfig.json /ohif/app/main/tsconfig.json
COPY --from=build /ohif/app/main/node_modules /ohif/app/main/node_modules
COPY --from=build /ohif/app/main/dist /ohif/app/main/dist

CMD ["npm", "run", "start:prod" ]