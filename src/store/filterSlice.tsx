import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckboxState {
  id: string;
  text: string;
  isCheck: boolean;
}

interface FilterState {
  filter: CheckboxState[]
}

const initialState: FilterState = {
  filter: [
    { id: "all", text: "Все", isCheck: false },
    { id: "none", text: "Без пересадок", isCheck: false },
    { id: "one", text: "1 пересадка", isCheck: false },
    { id: "two", text: "2 пересадки", isCheck: false },
    { id: "three", text: "3 пересадки", isCheck: false },
  ],
};

const filterSlice = createSlice({
  name: "filter",
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
  },
});

export const { handleCheckboxChange } = filterSlice.actions;
export default filterSlice.reducer;
