from faker import Factory
from faker.providers import internet
from time import sleep
import random
from datetime import datetime, timezone
import json

# Usage: python generate_logs.py >> input.txt

def main():
    fake = Factory.create()
    fake.add_provider(internet)

    while True:
        print(json.dumps({
            'time': datetime.now(timezone.utc).isoformat(),
            'ip': fake.ipv4_public(),
            'host': fake.hostname(),
            'path': fake.uri_path(),
            'ua': fake.user_agent()
        }))
        sleep(random.random() / 10)


if __name__ == '__main__':
    main()
