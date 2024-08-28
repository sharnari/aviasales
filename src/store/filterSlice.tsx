import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Service, { SearchIdResponce, TicketsResponse } from "../service/service";

interface CheckboxState {
  id: string;
  text: string;
  isCheck: boolean;
}

export interface StateAviasales {
  filter: CheckboxState[];
  filterTickets: string;
  status: null | string;
  error: null | string;
  tickets: any;
  searchId: null | string;
}

const service: Service = new Service();

export const fetchSearchId = createAsyncThunk<SearchIdResponce | undefined>(
  "store/fetchSearchId",
  async function () {
    return await service.getSearchId();
  }
);

export const fetchTickets = createAsyncThunk<
  TicketsResponse | undefined,
  string
>("store/fetchTickets", async function (searchId) {
  return await service.getTickets(searchId);
});

const initialState: StateAviasales = {
  filter: [
    { id: "all", text: "Все", isCheck: false },
    { id: "none", text: "Без пересадок", isCheck: false },
    { id: "one", text: "1 пересадка", isCheck: false },
    { id: "two", text: "2 пересадки", isCheck: false },
    { id: "three", text: "3 пересадки", isCheck: false },
  ],
  filterTickets: "самый дешевый",
  status: null,
  error: null,
  tickets: [],
  searchId: null,
};

const filterSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    handleCheckboxChange(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id === "all") {
        const isAllChecked = state.filter.find(
          (checkbox) => checkbox.id === "all"
        )?.isCheck;
        state.filter = state.filter.map((checkbox) => ({
          ...checkbox,
          isCheck: !isAllChecked,
        }));
      } else {
        const updatedCheckboxes = state.filter.map((checkbox) => {
          if (checkbox.id === id) {
            return { ...checkbox, isCheck: !checkbox.isCheck };
          }
          return checkbox;
        });

        const allChecked = updatedCheckboxes.every((checkbox) =>
          checkbox.id === "all" ? true : checkbox.isCheck
        );

        state.filter = updatedCheckboxes.map((checkbox) =>
          checkbox.id === "all"
            ? { ...checkbox, isCheck: allChecked }
            : checkbox
        );
      }
    },
    handleRadioChange(state, action: PayloadAction<string>) {
      state.filterTickets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchId.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchSearchId.fulfilled, (state, action) => {
      if (action.payload) {
        state.searchId = action.payload.searchId;
      }
      state.status = "succeeded";
    });
    builder.addCase(fetchSearchId.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch tickets";
    });
    builder.addCase(fetchTickets.pending, (state, action) => {
      state.status = "loading tickets";
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      if (action.payload) {
        state.tickets = action.payload.tickets;
      }
      state.status = "tickets succeeded";
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.status = "tickets failed";
      state.error = action.error.message || "Failed to fetch tickets";
    });
  },
});

export const { handleCheckboxChange, handleRadioChange } = filterSlice.actions;
export default filterSlice.reducer;
