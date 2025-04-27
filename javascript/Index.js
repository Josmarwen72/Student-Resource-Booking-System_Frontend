/* Index.js - Frontend logic with API integration */

// Base URL for backend API
const API_BASE = 'https://srbs-backend-postgress.onrender.com';

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Centralized response handler
async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || 'Request failed');
  return json;
}

document.addEventListener('DOMContentLoaded', () => {
  // ===== Registration =====
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', async e => {
      e.preventDefault();
      // Collect form data
      const data = {
        fullname: regForm.fullname.value.trim(),
        email: regForm.email.value.trim(),
        password: regForm.password.value,
        confirmPassword: regForm.confirmPassword.value
      };

      // Client-side validation
      if (data.password !== data.confirmPassword) {
        return alert('Passwords do not match');
      }

      try {
        // Send to correct auth/register endpoint
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await handleResponse(res);
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
      } catch (err) {
        console.error('Registration error:', err);
        alert(`Registration failed: ${err.message}`);
      }
    });
  }

  // ===== Login =====
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        email: loginForm.email.value.trim(),
        password: loginForm.password.value
      };

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await handleResponse(res);
        localStorage.setItem('token', json.token);
        window.location.href = 'resources.html';
      } catch (err) {
        console.error('Login error:', err);
        alert(`Login failed: ${err.message}`);
      }
    });
  }

  // ===== Book Slot =====
  document.querySelectorAll('.resource-card button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const resourceId = btn.dataset.resource;
      const slot = btn.dataset.slot;

      console.log('Booking attempt:', { resourceId, slot });
      try {
        const res = await fetch(`${API_BASE}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ resourceId, slot })
        });
        await handleResponse(res);
        alert('Booking confirmed!');
        window.location.reload();
      } catch (err) {
        console.error('Booking error:', err);
        alert(`Booking failed: ${err.message}`);
      }
    });
  });

  // ===== Current Bookings Management (Update & Cancel) =====
  document.querySelectorAll('.update-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const bookingId = e.target.dataset.booking;
      const updatedSlot = prompt('Enter the new slot time (e.g., 10:00 – 12:30pm):');
      if (updatedSlot) {
        try {
          const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders()
            },
            body: JSON.stringify({ slot: updatedSlot })
          });
          await handleResponse(res);
          alert('Booking updated!');
          window.location.reload();
        } catch (err) {
          console.error('Update error:', err);
          alert(`Update failed: ${err.message}`);
        }
      }
    });
  });

  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const bookingId = e.target.dataset.booking;
      if (confirm('Are you sure you want to cancel this booking?')) {
        try {
          const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders()
            }
          });
          await handleResponse(res);
          alert('Booking cancelled!');
          window.location.reload();
        } catch (err) {
          console.error('Cancel error:', err);
          alert(`Cancellation failed: ${err.message}`);
        }
      }
    });
  });
});
