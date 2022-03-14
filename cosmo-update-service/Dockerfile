FROM python

ARG DOCKER_TAG
ENV APP_VERSION=$DOCKER_TAG
RUN echo "Bulding Docker image version: $APP_VERSION"

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["app.py"]
