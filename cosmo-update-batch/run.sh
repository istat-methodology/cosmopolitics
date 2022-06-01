#!/bin/bash

MIN_WORKING_FOLDER_SPACE_GB=125

pip install -r requirements.txt
if [ -z "$WORKING_FOLDER" ]; then
   echo "WORKING_FOLDER not specified. Aborting." 1>&2
   exit 1
fi
FREESPACE_ON_WORKING_FOLDER=$(( $(stat -f --format="%a" $WORKING_FOLDER) * $(stat -f --format="%S" $WORKING_FOLDER) / 1024 / 1024 / 1024 ))
echo "Free Space on $WORKING_FOLDER: $FREESPACE_ON_WORKING_FOLDER GB"
if [ $FREESPACE_ON_WORKING_FOLDER -lt $MIN_WORKING_FOLDER_SPACE_GB ]; then
   echo "Insufficient disk space. Aborting." 1>&2
   exit 1
fi
python cosmoDataUpdate.py
