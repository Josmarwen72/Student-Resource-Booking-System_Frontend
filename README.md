# Student-Resource-Booking-System_Frontend


## Project Overview

The **Student Resource Booking System (SRBS) Frontend** is the user-facing part of the web-based application designed to allow students to book resources such as study rooms, labs, and materials. The frontend is built using HTML, CSS, and JavaScript, providing a responsive and interactive user interface.

### Features:
- **Registration and Login**: Allows users to create an account and log in.
- **Resource Booking**: Students can view available resources and book them for specific time slots.
- **View Current Bookings**: Students can see and manage their existing bookings.

---

## Here’s a short report summarizing the issue you encountered during the development of the **Student Resource Booking System (SRBS)**:

---

## Report on Issues Encountered during Development

### **Issue 1: CORS Policy Error**

**Description:**
While attempting to perform registration and login from the frontend, the following CORS error was encountered:
```
Access to fetch at 'http://192.168.100.7:4000/api/auth/register' from origin 'http://192.168.100.7:5500' has been blocked by CORS policy...
```

**Cause:**
This issue was caused by incorrect CORS configuration. The backend was not allowing the specific origin (`http://192.168.100.7:5500`) to access the resources.

**Solution:**
The CORS configuration was updated in the backend to specifically allow multiple origins (both local and remote). The CORS middleware was configured to include both `http://localhost:5500` and `http://192.168.100.7:5500` as allowed origins.

---

### **Issue 2: Failed Registration/Failed Fetch**

**Description:**
During the registration process, the following error message was displayed:
```
Registration error: TypeError: Failed to fetch
```

**Cause:**
This error was likely caused by either an incorrect API endpoint or CORS-related issues, resulting in the registration request not being properly processed by the backend.

**Solution:**
After resolving the CORS configuration, the issue was mitigated, allowing successful communication between the frontend and backend.

---

### **Issue 3: Slot Booking Issue**

**Description:**
The frontend was unable to add a slot when trying to make a booking.

**Cause:**
This issue was likely due to the absence of proper API calls or incorrect handling of the form submission in the frontend JavaScript logic.

**Solution:**
The frontend code was updated to properly integrate with the backend API for booking slots. The API calls now correctly handle booking submissions, sending the resource and time slot data to the backend.

---

### Conclusion:
After addressing the CORS issue and ensuring the frontend logic was correctly integrated with the backend API, all major issues were resolved. The system now allows for successful user registration, login, and resource booking functionalities.

---




