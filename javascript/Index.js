/* Index.js - Frontend logic with API integration */
const API_URL = 'http://localhost:5500/api';

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

document.addEventListener('DOMContentLoaded', () => {
  // Registration form
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        fullname: regForm.fullname.value,
        email: regForm.email.value,
        password: regForm.password.value,
        confirmPassword: regForm.confirmPassword.value
      };
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await handleResponse(res);
        alert('Registration successful! Please log in.');
        window.location.href = 'Login.html';
      } catch (err) {
        alert(`Registration error: ${err.message}`);
      }
    });
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        email: loginForm.email.value,
        password: loginForm.password.value
      };
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await handleResponse(res);
        localStorage.setItem('token', json.token);
        window.location.href = 'Resources.html';
      } catch (err) {
        alert(`Login error: ${err.message}`);
      }
    });
  }

  // Book resource buttons
  document.querySelectorAll('.resource-card button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const resourceId = btn.dataset.resource;
      const slot = btn.dataset.slot;
      try {
        const res = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ resourceId, slot })
        });
        await handleResponse(res);
        alert('Booking confirmed!');
        location.reload();
      } catch (err) {
        alert(`Booking error: ${err.message}`);
      }
    });
  });

  // New booking form
  const newB = document.getElementById('newBookingForm');
  if (newB) {
    newB.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        resourceId: newB.resourceId.value,
        slot: newB.slot.value
      };
      try {
        const res = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(data)
        });
        await handleResponse(res);
        alert('Booking successful!');
        newB.reset();
        location.reload();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
  }

  // Cancel & update in My Bookings
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bookingId = btn.dataset.booking;
      if (!confirm('Cancel this booking?')) return;
      try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        await handleResponse(res);
        alert('Booking cancelled');
        location.reload();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
  });
  document.querySelectorAll('.update-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bookingId = btn.dataset.booking;
      const newSlot = prompt('Enter new slot (e.g. 14:00-15:00):');
      if (!newSlot) return;
      try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ slot: newSlot })
        });
        await handleResponse(res);
        alert('Booking updated');
        location.reload();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
  });

  // Admin: Save resource
  const resForm = document.getElementById('resourceForm');
  if (resForm) {
    resForm.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        name: resForm.resName.value,
        category: resForm.resCat.value,
        description: resForm.resDesc.value
      };
      try {
        const res = await fetch(`${API_URL}/resources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(payload)
        });
        await handleResponse(res);
        alert('Resource saved');
        location.reload();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
  }

  // Admin: Delete resource
  document.querySelectorAll('.delete-res').forEach(btn => {
    btn.addEventListener('click', async () => {
      const resId = btn.dataset.id;
      if (!confirm('Delete this resource?')) return;
      try {
        const res = await fetch(`${API_URL}/resources/${resId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        await handleResponse(res);
        alert('Resource deleted');
        location.reload();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
  });

  // Admin: Cancel any booking
  document.querySelectorAll('.cancel-admin').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bookingId = btn.dataset.booking;
      if (!confirm('Cancel this booking?')) return;
      try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        await handleResponse(res);
        alert('Booking cancelled');
        location.reload();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
  });
});
