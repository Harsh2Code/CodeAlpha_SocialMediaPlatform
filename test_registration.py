
import requests
import json

url = "https://socialmedia-backend-ipwx.onrender.com/api/register/"

payload = json.dumps({
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpassword"
})

headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
