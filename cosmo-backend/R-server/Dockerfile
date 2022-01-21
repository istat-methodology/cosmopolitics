FROM rocker/r-base


COPY . /app
WORKDIR /app

RUN apt-get update  
RUN cat libraries-bin.txt | xargs apt-get install -y -qq
RUN Rscript libraries.R
 
CMD ["Rscript", "api-controller.R"]

