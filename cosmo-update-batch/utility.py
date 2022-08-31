
import os
import json
import numpy as np
from dateutil.rrule import rrule, MONTHLY
import datetime

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

def month_iter(start_month, start_year, end_month, end_year):
    start = datetime.datetime(start_year, start_month, 1)
    end = datetime.datetime(end_year, end_month, 1)
    return (('%02d' %d.month, d.year) for d in rrule(MONTHLY, dtstart=start, until=end))


def createFolder(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)