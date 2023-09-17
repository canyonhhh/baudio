#!/usr/bin/env python3
import cgi
import json
import os
import sys

timestamp_file = "timestamp.txt"

def save_timestamp(timestamp):
    with open(timestamp_file, "w") as f:
        f.write(str(timestamp))

def get_timestamp():
    if os.path.exists(timestamp_file):
        with open(timestamp_file, "r") as f:
            return f.read()
    return "0"

if os.environ['REQUEST_METHOD'] == 'POST':
    content_length = int(os.environ['CONTENT_LENGTH'])
    post_data = sys.stdin.read(content_length)
    # post_data = os.environ['wsgi.input'].read(content_length)
    data = json.loads(post_data)
    # data = json.loads(post_data.decode("utf-8"))
    save_timestamp(data['timestamp'])
    print("Content-type: text/plain\n")
    print("Timestamp saved.")
else:
    print("Content-type: text/plain\n")
    print(get_timestamp())
