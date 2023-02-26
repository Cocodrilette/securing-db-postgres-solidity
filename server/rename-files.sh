#!/bin/bash

# Check if the help flag is given
if [ "$1" == "--help" ]; then
    echo "Usage: scriptname.sh <action: '--cut' | '--add'> <directory_path> <string_to_add|string_to_remove>"
    echo "Renames all files in the directory by adding or removing a string at the beginning of the actual file name."
    exit 0
fi

# Check if the necessary parameters are given
if [ $# -lt 3 ]; then
    echo "Error: Missing parameters. Usage: scriptname.sh <action: '--cut' | '--add'> <directory_path> <string_to_add|string_to_remove>"
    exit 1
fi

# Get the directory path, action and string as parameters
action=$1
dir=$2
string=$3

# Loop through all files in the directory
for file in "$dir"/*; do
    # Get the file name without the path
    file_name=$(basename "$file")
    if [ "$action" == "--add" ]; then
        # Add the string to the beginning of the file name
        new_file_name="$string$file_name"
    elif [ "$action" == "--cut" ]; then
        # Remove the string from the beginning of the file name
        new_file_name=${file_name#$string}
        if [ "$file_name" == "$new_file_name" ]; then
            echo "Error: A file does not contains any slice that match with the given string"
            continue
        fi
    else
        echo "Error: Unrecognized action $action. Use --add or --cut"
        exit 1
    fi
    # Rename the file
    mv "$file" "$dir/$new_file_name"
done
