# Instructions to Create/Register User "falana"

The backend uses a registration API endpoint to create new users.

## API Endpoint

POST http://localhost:8000/register/

## Request Body (JSON)

```json
{
  "username": "falana",
  "email": "falana@example.com",
  "password": "your_secure_password",
  "date_of_birth": "YYYY-MM-DD",
  "gender": "your_gender"
}
```

- Replace `your_secure_password` with a strong password.
- Replace `YYYY-MM-DD` with the actual date of birth.
- Replace `your_gender` with the gender string (optional).

## Example using curl

```bash
curl -X POST http://localhost:8000/register/ \
-H "Content-Type: application/json" \
-d '{
  "username": "falana",
  "email": "falana@example.com",
  "password": "your_secure_password",
  "date_of_birth": "1990-01-01",
  "gender": "female"
}'
```

## After successful registration

- The user "falana" will exist in the backend database.
- The follow status API will return correct results for "falana".
- The 404 error for "falana" will be resolved.

Please use this API or the Django admin panel to create the user "falana".
