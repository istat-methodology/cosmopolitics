#!/bin/bash

pip install -r requirements.txt 
export WORKING_FOLDER=$AZ_BATCH_TASK_WORKING_DIR
python cosmoDataUpdate.py
