import axiosInstance from "./axiosConfig";

export interface Counselor {
  id: number;
  email: string;
  full_name: string;
}

export async function registerCounselor(data: {
  email: string;
  full_name: string;
}) {
  const response = await axiosInstance.post(
    "/users/counselors/register/",
    data,
  );
  return response.data as {
    message: string;
    id: number;
    email: string;
    full_name: string;
  };
}

export async function getCounselors(): Promise<Counselor[]> {
  const response = await axiosInstance.get<Counselor[]>("/users/counselors/");
  return response.data;
}
