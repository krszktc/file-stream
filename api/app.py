import json
import os
from json import JSONDecodeError
from typing import IO
from flask import Flask, Response, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


def __filter(json_str: str, params: list) -> bool:
    parse_status = True
    json_line = {}
    try:
        json_line = json.loads(json_str)
    except JSONDecodeError:
        return False
    for param in params:
        if param not in json_line or json_line[param].find(params[param]) == -1:
            parse_status = False
            break

    return parse_status


def __parse_file(params: list, file: IO[str]):
    last_file_size = 0
    while True:
        line = file.readline()
        file_size = os.path.getsize('input.txt')
        if last_file_size > file_size > 0:
            last_file_size = file_size
            file.seek(0,0)
        if line != '' and __filter(line, params):
            last_file_size = file_size
            yield line.strip() + '\n'


@app.route('/stream-file')
def stream_file():
    try:
        file = open('input.txt', 'r')
        return Response(__parse_file(request.args, file), mimetype='text/event-stream')
    except FileNotFoundError:
        pass

    return 'Log file doesn\'t exist'


if __name__ == '__main__':
    app.run()
