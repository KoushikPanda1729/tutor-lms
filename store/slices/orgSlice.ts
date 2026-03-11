import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization, Batch } from "@/types";

interface OrgState {
  currentOrg: Organization | null;
  batches: Batch[];
}

const initialState: OrgState = {
  currentOrg: null,
  batches: [],
};

const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    setCurrentOrg(state, action: PayloadAction<Organization>) {
      state.currentOrg = action.payload;
    },
    setBatches(state, action: PayloadAction<Batch[]>) {
      state.batches = action.payload;
    },
    addBatch(state, action: PayloadAction<Batch>) {
      state.batches.push(action.payload);
    },
  },
});

export const { setCurrentOrg, setBatches, addBatch } = orgSlice.actions;
export default orgSlice.reducer;
