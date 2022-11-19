FROM node:14-alpine

LABEL Maintainer="Hieupv <hieu.pv@zetagroup.vn>" \
    Description="Lightweight container for nodejs application on Alpine Linux."

# Install required packages
# RUN apk --no-cache add curl bash git libgit2-dev krb5-libs python tzdata pkgconfig build-base

# Configure supervisord
# ADD ./.docker/supervisor/master.ini /etc/supervisor.d/
# ADD ./.docker/nginx/nginx.conf /etc/nginx/nginx.conf

# ENV NODE_ENV=production

WORKDIR /app

RUN npm i -g @nestjs/cli

COPY . .

RUN yarn build

CMD ["yarn", "start"]