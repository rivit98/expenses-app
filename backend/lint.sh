#!/bin/bash

set -o errexit

if [ "$#" -ne 1 ]; then
    echo "Specify format or lint"
    exit 1
fi

if [[ "$1" == "format" ]]; then
  echo "Formatting..."
  isort .
  black .
  flake8 .
fi

if [[ "$1" == "lint" ]]; then
  echo "Linting..."
  isort --check-only --diff .
  black --diff --check .
  flake8 --show-source .
fi


