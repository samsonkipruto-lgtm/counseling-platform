import axiosInstance from "./axiosConfig";

export interface RegisterPayload {
  email: string;
  full_name: string;
}

export interface RegisterResponse {
  message: string;
  alias: string;
}

export interface RequestOtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  access: string;
  refresh: string;
  role: "student" | "counselor" | "admin";
}

export async function registerStudent(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await axiosInstance.post<RegisterResponse>(
    "/users/register/",
    payload,
  );
  return response.data;
}

export async function requestOTP(email: string): Promise<RequestOtpResponse> {
  const response = await axiosInstance.post<RequestOtpResponse>(
    "/otp/request/",
    { email },
  );
  return response.data;
}

export async function verifyOTP(
  email: string,
  otp: string,
): Promise<VerifyOtpResponse> {
  const response = await axiosInstance.post<VerifyOtpResponse>("/otp/verify/", {
    email,
    otp,
  });
  return response.data;
}
