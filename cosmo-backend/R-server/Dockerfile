FROM rocker/r-base

ARG DOCKER_TAG
ENV APP_VERSION=$DOCKER_TAG
RUN echo "Bulding Docker image version: $APP_VERSION"

COPY . /app
WORKDIR /app

RUN apt-get update  
RUN cat libraries-bin.txt | xargs apt-get install -y -qq
RUN Rscript libraries.R
 
CMD ["Rscript", "api-controller.R"]

