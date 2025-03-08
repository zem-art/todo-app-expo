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