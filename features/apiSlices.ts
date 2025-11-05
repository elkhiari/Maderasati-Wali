import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./middlewares/authMiddleware";

const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
