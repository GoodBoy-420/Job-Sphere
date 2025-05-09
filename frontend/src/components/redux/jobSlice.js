import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
   
    allAppliedJobs: [],
  
  },
  reducers: {
    
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
  
  },
});
export const {

  
  setAllAppliedJobs,
 
} = jobSlice.actions;
export default jobSlice.reducer;  