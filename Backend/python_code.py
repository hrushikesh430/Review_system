import sys
import json

# Read JSON data from stdin
json_data = sys.stdin.read()

try:
    # Parse the JSON data
    data_from_node = json.loads(json_data)

    # Process the data (replace this with your logic)
    print("Received data from Node.js: this is data :-----> ", data_from_node)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
