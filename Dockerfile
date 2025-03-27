FROM denoland/deno

RUN apt-get update && \
    apt-get install -y postgresql-client locales && \
    rm -rf /var/lib/apt/lists/* && \
    localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

EXPOSE 8000

WORKDIR /app
COPY . /app
RUN chmod +x /app/init.sh

ENTRYPOINT ["/app/init.sh"]
