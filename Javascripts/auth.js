// javascripts/auth.js
class AuthManager {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // Register user
  async register(username, email, phone, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          phone: phone // Store phone locally since backend doesn't have it yet
        }));
        
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Unable to connect to server. Please try again.' };
    }
  }

  // Login user
  async login(identifier, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Unable to connect to server. Please try again.' };
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.token && this.refreshToken) {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ refreshToken: this.refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token && !!localStorage.getItem('user');
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.token = data.accessToken;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Make authenticated API request
  async authenticatedRequest(url, options = {}) {
    try {
      // Add authorization header
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      };

      let response = await fetch(url, options);

      // If token expired, try to refresh
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry request with new token
          options.headers['Authorization'] = `Bearer ${this.token}`;
          response = await fetch(url, options);
        } else {
          // Refresh failed, logout user
          this.logout();
          return null;
        }
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      return null;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await this.authenticatedRequest(`${this.baseURL}/user/profile`);
      if (response && response.ok) {
        const data = await response.json();
        return { success: true, data: data.user };
      }
      return { success: false, error: 'Failed to fetch profile' };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { success: false, error: 'Unable to fetch profile' };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await this.authenticatedRequest(`${this.baseURL}/user/profile`, {
        method: 'PUT',
        body: JSON.stringify({ profile: profileData })
      });

      if (response && response.ok) {
        const data = await response.json();
        // Update local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, data: data.user };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Unable to update profile' };
    }
  }

  // Forgot Password - Request reset link
  async forgotPassword(email) {
    try {
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Unable to connect to server. Please try again.' };
    }
  }

  // Reset Password - Reset with token
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Unable to connect to server. Please try again.' };
    }
  }

  // Change Password (for logged in users)
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.authenticatedRequest(`${this.baseURL}/user/change-password`, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response && response.ok) {
        const data = await response.json();
        // Clear tokens as backend invalidates all sessions
        this.logout();
        return { success: true, message: data.message };
      }
      
      if (response) {
        const data = await response.json();
        return { success: false, error: data.error };
      }
      
      return { success: false, error: 'Failed to change password' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Unable to change password' };
    }
  }
}

// Initialize and export auth manager
const auth = new AuthManager();
window.auth = auth;