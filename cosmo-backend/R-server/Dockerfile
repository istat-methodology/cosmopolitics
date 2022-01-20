#FROM rocker/tidyverse
FROM rocker/r-base
#FROM rocker/r-ubuntu

COPY . /app/R-server
COPY /data/ /app/R-server/data
COPY /rscript/ /app/R-server/rscript 
WORKDIR /app/R-server

RUN apt-get update  
RUN cat libraries-bin.txt | xargs apt-get install -y -qq
RUN Rscript libraries.R
 
CMD ["Rscript", "api-controller.R"]

