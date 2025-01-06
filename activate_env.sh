#!/bin/bash

# First, deactivate any active virtual environment
if [[ "$VIRTUAL_ENV" != "" ]]; then
    deactivate
    echo "Deactivated previous virtual environment"
fi

# Change to the backend directory
cd backend

# Activate the virtual environment
source venv/bin/activate

echo "Activated virtual environment in backend directory"
