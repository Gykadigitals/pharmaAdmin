export const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'https://3f9f-2409-40f0-11d1-ad16-2c93-26ed-319a-a530.ngrok-free.app/';
export const API_BASE_URL = `${SERVER_URL}/api`;
export const IMAGE_BASE_URL = SERVER_URL;

export const ENDPOINTS = {
  AUTH: {
    VALIDATE_TENANT: `${API_BASE_URL}/auth/validate-tenant`,
    LOGIN: `${API_BASE_URL}/auth/web-login`,
    SEND_LOGIN_OTP: `${API_BASE_URL}/auth/send-login-otp`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    USERS_MAP: `${API_BASE_URL}/admin/users-map`,
    HIERARCHY: `${API_BASE_URL}/admin/hierarchy`,
  },
  ROLES: {
    BASE: `${API_BASE_URL}/roles`,
    USERS: `${API_BASE_URL}/roles/users`,
  },
};
