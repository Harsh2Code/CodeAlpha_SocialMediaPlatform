
import requests
import json

url = "https://socialmedia-backend-ipwx.onrender.com/api/api-token-auth/"

payload = json.dumps({
  "email": "test@example.com",
  "password": "testpassword"
})

headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
