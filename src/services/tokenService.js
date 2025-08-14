import axios from 'axios';

const ACCESS_TOKEN_KEY = 'token';
const LOGIN_TIME_KEY = 'loginTime';
const TOKEN_EXPIRY_MINUTES = 30; // 30 minutes token lifetime
const TOKEN_REFRESH_BUFFER = 60000; // 1 minute before expiry
const REFRESH_ENDPOINT = 'https://creditor-backend-1-iijy.onrender.com/api/auth/refresh';

let refreshTimeout = null;

// Format time for console logs
const formatTime = () => {
  return new Date().toLocaleTimeString();
};

// Show token status with emoji for better visibility
const logTokenStatus = (message, isError = false) => {
  const prefix = isError ? '❌' : '🔑';
  console.log(`[${formatTime()}] ${prefix} ${message}`);
};

// Save login time when user logs in
const saveLoginTime = () => {
  const loginTime = Date.now();
  const expiryTime = new Date(loginTime + (TOKEN_EXPIRY_MINUTES * 60 * 1000));
  localStorage.setItem(LOGIN_TIME_KEY, loginTime.toString());
  logTokenStatus(`🔐 Login successful! Token will expire at ${expiryTime.toLocaleTimeString()}`);
  return loginTime;
};

// Calculate remaining time until token expiry
const getRemainingTime = () => {
  const loginTime = localStorage.getItem(LOGIN_TIME_KEY);
  if (!loginTime) {
    logTokenStatus('No login time found', true);
    return 0;
  }
  
  const loginTimeNum = parseInt(loginTime, 10);
  const expiryTime = loginTimeNum + (TOKEN_EXPIRY_MINUTES * 60 * 1000);
  const remaining = expiryTime - Date.now();
  
  // Log time remaining in minutes and seconds
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  if (remaining > 0) {
    logTokenStatus(`⏳ Token will expire in ${minutes}m ${seconds}s`);
  }
  
  return Math.max(0, remaining);
};

// Set up automatic token refresh based on login time
const setupTokenRefresh = (onRefreshSuccess, onRefreshError) => {
  // Clear any existing timeout
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }

  const remainingTime = getRemainingTime();
  
  // If no valid login time or token already expired, don't set up refresh
  if (remainingTime <= 0) {
    logTokenStatus('❌ Not setting up refresh - no valid session', true);
    if (onRefreshError) onRefreshError(new Error('No valid session'));
    return;
  }

  const refreshTime = Math.max(0, remainingTime - TOKEN_REFRESH_BUFFER);
  const refreshAt = new Date(Date.now() + refreshTime);
  
  // Log when the next refresh will occur
  const refreshInMinutes = Math.ceil(refreshTime / 60000);
  logTokenStatus(`🔄 Auto-refresh scheduled in ${refreshInMinutes} minute${refreshInMinutes !== 1 ? 's' : ''} at ~${refreshAt.toLocaleTimeString()}`);

  // Set up refresh before token expires
  refreshTimeout = setTimeout(() => {
    logTokenStatus('🔄 Attempting to refresh access token...');
    refreshToken()
      .then(() => {
        logTokenStatus('✅ Token refreshed successfully!');
        if (onRefreshSuccess) onRefreshSuccess();
      })
      .catch((error) => {
        logTokenStatus(`❌ Refresh failed: ${error.message}`, true);
        if (onRefreshError) onRefreshError(error);
      });
  }, refreshTime);
};

// Refresh the access token using the refresh token from cookies
const refreshToken = async () => {
  try {
    const response = await axios.post(REFRESH_ENDPOINT, {}, {
      withCredentials: true // Important for sending cookies
    });

    if (response.data.accessToken) {
      const newToken = response.data.accessToken;
      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
      
      // Update login time to extend the session
      const newLoginTime = saveLoginTime();
      const newExpiry = new Date(newLoginTime + (TOKEN_EXPIRY_MINUTES * 60 * 1000));
      logTokenStatus(`🔄 Token refreshed! New expiry at ${newExpiry.toLocaleTimeString()}`);
      
      return newToken;
    }
    
    throw new Error('No access token in response');
  } catch (error) {
    logTokenStatus(`❌ Refresh error: ${error.message}`, true);
    throw error;
  }
};

// Clear the refresh timeout and login time
const clearTokenRefresh = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
  localStorage.removeItem(LOGIN_TIME_KEY);
  logTokenStatus('Token refresh system cleared');
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};

export { 
  setupTokenRefresh, 
  saveLoginTime, 
  refreshToken, 
  clearTokenRefresh, 
  isAuthenticated 
};
