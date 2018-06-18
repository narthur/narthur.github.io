FROM jekyll/jekyll:latest

ENV MAGICK_HOME=/usr

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.5/main' >> /etc/apk/repositories

RUN apk add --no-cache imagemagick6 && \
	apk add --no-cache imagemagick6-dev