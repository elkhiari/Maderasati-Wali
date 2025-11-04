import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginResponse {
  token: string;
  user_id: string;
  driver_id: string;
  username: string;
  email: string;
  role: string;
  expiration: string;
}

interface UserState {
  user: LoginResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpiration: string | null;
  hasOnboarded?: boolean;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  sessionExpiration: null,
  hasOnboarded: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.sessionExpiration = action.payload.expiration;
      state.hasOnboarded = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.user;
export const selectCurrentToken = (state: { user: UserState }) =>
  state.user.token;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;

export const selectHasOnboarded = (state: { user: UserState }) =>
  state.user.hasOnboarded;
