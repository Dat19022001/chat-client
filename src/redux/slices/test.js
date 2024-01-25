import { createSlice } from "@reduxjs/toolkit";

const testSlice = createSlice({
  name: "test",
  initialState: {
    storageField: [],
    messRecevied: [],
  },
  reducers: {
    // Các reducer để thay đổi trạng thái
    setStorageField: (state, action) => {
      const kiemtra = state.storageField.some(
        (item) => item.idChat === action.payload.idChat
      );
      if (state.storageField.length !== 0) {
        if (!kiemtra) {
          state.storageField = [...state.storageField, action.payload];
        }
      } else {
        state.storageField = [...state.storageField, action.payload];
      }
    },
    setDeleteMess: (states, action) => {
      states.storageField = states.storageField.filter(
        (item) => item.idChat !== action.payload
      );
    },
    setMessRecevied: (state, action) => {
      const check = state.messRecevied.some((item) => item === action.payload);
      if (state.messRecevied.length !== 0) {
        if (!check) {
          state.messRecevied = [...state.messRecevied, action.payload];
        }
      } else {
        state.messRecevied = [...state.messRecevied, action.payload];
      }
    },
    setDeleteMessRecevied: (states, action) => {
      states.messRecevied = states.messRecevied.filter(
        (item) => item !== action.payload
      );
    },
  },
});

export const {
  setStorageField,
  setDeleteMess,
  setMessRecevied,
  setDeleteMessRecevied,
} = testSlice.actions;
export const selectStorageField = (state) => state.test.storageField;
export const selectMessRecevied = (state) => state.test.messRecevied;
export default testSlice.reducer;
