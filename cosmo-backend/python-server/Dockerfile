FROM python
COPY . /app/python-server
COPY /data/ /app/python-server
WORKDIR /app/python-server
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["app.py"]