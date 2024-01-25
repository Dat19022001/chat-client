import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openMessRasa: false,
  updateListFriend: null,
};

const appReducer = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOpenMessRasa: (state, action) => {
      state.openMessRasa = action.payload;
    },
    setUpdateListFriend: (state, action) => {
      state.updateListFriend = action.payload;
    },
  },
});

export const { setOpenMessRasa, setUpdateListFriend } = appReducer.actions;
export default appReducer.reducer;
