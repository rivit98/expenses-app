#!/bin/bash

set -o errexit

if [ "$#" -ne 1 ]; then
  echo "Specify format or lint"
  exit 1
fi

if [[ "$1" == "format" ]]; then
  echo "Formatting..."
  ruff check --output-format=full --show-fixes --fix .
fi

if [[ "$1" == "lint" ]]; then
  echo "Linting..."
  ruff check --output-format=full .
fi
