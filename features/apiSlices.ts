import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./middlewares/authMiddleware";

const API_BASE_URL = "https://api-rec.maderasati.ma";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
