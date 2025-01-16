import { configureStore } from '@reduxjs/toolkit';

// A sample reducer (Replace this with your actual reducer)
const authReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ Now the store has a valid reducer
  },
});

export { store };
