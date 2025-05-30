export interface FormDataSignInPayload {
  email: string;
  password: string;
}
export interface FormDataSignInError {
  email?: string;
  password?: string;
}

export interface FormDataSignUpPayload {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface FormDataSignUpError {
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

export interface FormDataForgotPasswordPayload {
  current_password?: string;
  password?: string;
  confirm_password?: string;
}

export interface FormDataEmailPayload {
  email?: string;
}