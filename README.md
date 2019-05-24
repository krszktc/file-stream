Task
=======

Simple log streaming app

Environment
=========

There is a file where logs are write increasingly, in JSON format (by generate_logs.py)
Addiional service care about log rotation (log_rotation.py).


Minimal requirement
===================

  * logs are stream display in table in real time
  * simple filtering is possible

Additional requirements
=========================

  * possibility to keep only last N lines in UI side.
  * display only lsat N log lines (`tail -f`)
  * debounce on inputs
  * reload connection in case of network problem
