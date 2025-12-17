Here are the **Thunder Client** sample requests for creating an admin user and testing the system:

## **🔐 1. Register Admin User**

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "fullname": "Admin Manager",
  "phone": "0788534710",
  "password": "admin123",
  "role": "ParkingManager"
}
```

---

## **🔐 2. Register Driver User**

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "fullname": "Judson MUTABAZI",
  "phone": "0783936555",
  "password": "driver123",
  "role": "Driver"
}
```

---

## **🔑 3. Login as Admin**

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "phone": "0788534710",
  "password": "admin123"
}
```

**Response:** You'll get a token like:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "fullname": "Admin Manager",
    "phone": "0788534710",
    "role": "ParkingManager"
  }
}
```

**⚠️ Copy the token!** You'll need it for protected routes.

---

## **🚗 4. Record Vehicle Entry (Manager Only)**

**Method:** `POST`  
**URL:** `http://localhost:3000/api/parking/entry`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```
**Body (JSON):**
```json
{
  "plateNumber": "RAD 123A",
  "vehicleType": "Car"
}
```

---

## **🚪 5. Record Vehicle Exit (Manager Only)**

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/parking/exit/1`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

*(Replace `1` with the actual recordId)*

---

## **📊 6. View Parked Vehicles (Manager Only)**

**Method:** `GET`  
**URL:** `http://localhost:3000/api/parking/parked-vehicles`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## **📈 7. Get Daily Report (Manager Only)**

**Method:** `GET`  
**URL:** `http://localhost:3000/api/reports/daily?date=2024-12-17`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## **📋 8. View My Parking Records (Driver)**

**Method:** `GET`  
**URL:** `http://localhost:3000/api/parking/my-records`  
**Headers:**
```
Authorization: Bearer YOUR_DRIVER_TOKEN_HERE
```

---

## **💡 Thunder Client Tips:**

1. **Save the token** in Thunder Client Environment:
   - Go to **Env** tab
   - Create variable: `token`
   - Use: `{{token}}` in Authorization header

2. **Create a Collection** with all these requests

3. **Use the Auth tab** in Thunder Client:
   - Type: `Bearer Token`
   - Token: `{{token}}`

This way you don't have to copy/paste the token every time! 🎯