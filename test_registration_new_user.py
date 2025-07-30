import requests
import json

url = "https://socialmedia-backend-ipwx.onrender.com/api/register/"

payload = json.dumps({
  "username": "newtestuser",
  "email": "newtest@example.com",
  "password": "newtestpassword",
  "first_name": "",
  "last_name": "",
  "date_of_birth": None,
  "gender": "",
  "nationality": ""
})

headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)