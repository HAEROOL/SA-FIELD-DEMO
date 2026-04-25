import axios from "axios";

function resolveBaseURL(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "/api/";
  if (typeof window !== "undefined") return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  // Server-side + relative base: prepend localhost so axios can resolve it.
  // Pages that need this must opt into runtime rendering (e.g. export const dynamic = "force-dynamic")
  // so the Next.js server is actually listening when the fetch is issued.
  const port = process.env.PORT || "3000";
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return `http://127.0.0.1:${port}${normalized}`;
}

export const axiosInstance = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here if needed
    return Promise.reject(error);
  }
);
