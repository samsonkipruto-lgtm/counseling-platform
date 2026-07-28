import axiosInstance from "./axiosConfig";

export interface AliasResponse {
  alias: string;
}

export async function getMyAlias(): Promise<AliasResponse> {
  const response = await axiosInstance.get<AliasResponse>("/my-alias/");
  return response.data;
}
