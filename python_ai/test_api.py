import requests
import json

def test_irrigation_analysis():
    url = "http://localhost:5001/api/irrigation/analyze"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "field_id": "field_001",
        "location": "London"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_irrigation_analysis() 