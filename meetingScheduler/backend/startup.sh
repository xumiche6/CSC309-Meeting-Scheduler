#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

cd OneOnOne

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
	sudo apt-get update
	sudo apt-get -y upgrade
	sudo apt install -y python3.8-venv make
fi

echo "Checking for an existing virtual environment..."
if [ ! -d "venv" ]; then
  echo "Creating a virtual environment and installing required packages..."
  python3 -m venv venv
  echo "Virtual environment created."
else
  echo "Virtual environment already exists."
fi

# Activate the virtual environment (conditional for Linux, macOS, and Windows)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    source venv/bin/activate
elif [[ "$OSTYPE" == "darwin"* ]]; then
    source venv/bin/activate
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    echo "Unsupported OS"
    exit 1
fi

# Install required packages from requirements.txt
pip install -r ./requirements.txt

# Run Django migrations
python manage.py makemigrations
python manage.py migrate
make load
echo "Creating superuser"
# Create a superuser
python manage.py createsuperuser

# Deactivate the virtual environment
deactivate
