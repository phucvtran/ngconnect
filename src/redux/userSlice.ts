import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userInfo: any;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: UserState = {
  userInfo: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") + "")
    : null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.userInfo = action.payload.userInfo;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("user", JSON.stringify(state.userInfo)); // Save to localStorage
      localStorage.setItem("accessToken", state.accessToken as string);
      localStorage.setItem("refreshToken", state.refreshToken as string);
    },
    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user"); // Remove from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
  },
});
export const { login, logout, updateAccessToken } = userSlice.actions;
export default userSlice.reducer;
