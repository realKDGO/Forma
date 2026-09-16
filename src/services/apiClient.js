import axios from "axios";
import { supabase } from "./authService";

// Local services currently own the data. Future API-backed implementations
// can share this client without changing feature components.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 15000,
  headers: { Accept: "application/json" },
});
apiClient.interceptors.request.use(async config => { const session=(await supabase?.auth.getSession())?.data?.session; if(session?.access_token) config.headers.Authorization=`Bearer ${session.access_token}`; return config; });
apiClient.interceptors.response.use(r=>r,e=>Promise.reject({status:e.response?.status,code:e.response?.data?.error?.code||'NETWORK_ERROR',message:e.response?.data?.error?.message||'Forma could not reach the server.',fields:e.response?.data?.error?.fields||{}}));
