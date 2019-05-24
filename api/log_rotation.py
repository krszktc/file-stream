import os
import time


def __rotate():
    new_name = 'input_' + str(time.time()).split('.')[0] + '.txt'
    try:
        f = open('input.txt', 'r+')
        lines = f.read()
        f.seek(0,0)
        f.truncate()
        f.close()

        nf = open(new_name, 'w')
        nf.write(lines)
        nf.close()

    except PermissionError as e:
        pass


def main():
    while True:
        file_size = os.path.getsize('input.txt')
        time.sleep(1)
        print('---')
        print(file_size)
        if file_size > 100000:
            __rotate()


if __name__ == '__main__':
    main()
