FROM rocker/r-base

ARG DOCKER_TAG
ENV APP_VERSION=$DOCKER_TAG
RUN echo "Bulding Docker image version: $APP_VERSION"

COPY libraries-bin.txt .
COPY libraries.R .

RUN apt-get update && \
    cat libraries-bin.txt | xargs apt-get install -y -qq
RUN Rscript libraries.R && rm libraries-bin.txt libraries.R

COPY . /app
WORKDIR /app

CMD ["Rscript", "api-controller.R"]
