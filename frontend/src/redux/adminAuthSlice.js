import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    loading: false,
    admin: null,
  },
  reducers: {
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    clearAdmin: (state) => {
      state.admin = null;  // Clears the admin state when logged out
    },
  },
});

export const { setAdminLoading, setAdmin, clearAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
