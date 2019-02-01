#!/bin/bash

curl -fsSL https://bootstrap.pypa.io/get-pip.py | python - --user
pip install --user transifex-client==0.12.5
install -m0644 .transifexrc.tpl ~/.transifexrc
echo "password = $TX_PASSWD" >> ~/.transifexrc
