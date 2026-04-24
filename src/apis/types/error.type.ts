import { AxiosError } from "axios";

export interface ApiErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

export function getApiErrorMessage(
  error: AxiosError<ApiErrorResponse>,
  fallback: string
): string {
  return error.response?.data?.message || fallback;
}
