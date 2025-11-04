import { apiSlice } from "../apiSlices";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user_id: string;
  driver_id: string;
  username: string;
  email: string;
  role: string;
  expiration: string;
}

interface AdminLoginResponse {
  status: string;
  message: string;
  code: number;
  data: LoginResponse;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    mobileLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/mobile/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: AdminLoginResponse) => response.data,
    }),
  }),
});

export const { useMobileLoginMutation } = userApi;
