import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import Service, { SearchIdResponce, Ticket } from '../service/service'

export interface CheckboxState {
  id: string
  text: string
  isCheck: boolean
}

export interface StateAviasales {
  filter: CheckboxState[]
  filterTickets: string
  status: null | string
  error: null | string
  tickets: Ticket[]
  searchId: null | string
  displayedTicketsCount: number
}

const service: Service = new Service()

export const fetchSearchId = createAsyncThunk<SearchIdResponce | undefined>('store/fetchSearchId', async function () {
  return await service.getSearchId()
})

export const fetchTickets = createAsyncThunk<void, string>('store/fetchTickets', async (searchId, { dispatch }) => {
  let shouldContinue = true
  while (shouldContinue) {
    const response = await service.getTickets(searchId)
    if (response) {
      const { tickets, stop } = response
      dispatch(addTickets(tickets)) // Добавляем новые билеты по мере получения
      shouldContinue = !stop
    }
  }
})

const initialState: StateAviasales = {
  filter: [
    { id: 'all', text: 'Все', isCheck: true },
    { id: 'none', text: 'Без пересадок', isCheck: true },
    { id: 'one', text: '1 пересадка', isCheck: true },
    { id: 'two', text: '2 пересадки', isCheck: true },
    { id: 'three', text: '3 пересадки', isCheck: true },
  ],
  filterTickets: 'самый дешевый',
  status: null,
  error: null,
  tickets: [],
  searchId: null,
  displayedTicketsCount: 5,
}

const filterSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    handleCheckboxChange(state, action: PayloadAction<string>) {
      const id = action.payload
      if (id === 'all') {
        const isAllChecked = state.filter.find((checkbox) => checkbox.id === 'all')?.isCheck
        state.filter = state.filter.map((checkbox) => ({
          ...checkbox,
          isCheck: !isAllChecked,
        }))
      } else {
        const updatedCheckboxes = state.filter.map((checkbox) => {
          if (checkbox.id === id) {
            return { ...checkbox, isCheck: !checkbox.isCheck }
          }
          return checkbox
        })

        const allChecked = updatedCheckboxes.every((checkbox) => (checkbox.id === 'all' ? true : checkbox.isCheck))

        state.filter = updatedCheckboxes.map((checkbox) =>
          checkbox.id === 'all' ? { ...checkbox, isCheck: allChecked } : checkbox
        )
      }
    },

    handleRadioChange(state, action: PayloadAction<string>) {
      state.filterTickets = action.payload
    },

    showMoreTickets(state) {
      state.displayedTicketsCount += 5
    },

    addTickets(state, action: PayloadAction<Ticket[]>) {
      state.tickets.push(...action.payload) // Добавляем новые билеты
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSearchId.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })
    builder.addCase(fetchSearchId.fulfilled, (state, action) => {
      if (action.payload) {
        state.searchId = action.payload.searchId
      }
      state.status = 'succeeded'
    })
    builder.addCase(fetchSearchId.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message || 'Failed to fetch tickets'
    })
    builder.addCase(fetchTickets.pending, (state) => {
      state.status = 'loading tickets'
    })
    builder.addCase(fetchTickets.fulfilled, (state) => {
      state.status = 'tickets succeeded'
    })
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.status = 'tickets failed'
      state.error = action.error.message || 'Failed to fetch tickets'
    })
  },
})

export const { handleCheckboxChange, handleRadioChange, showMoreTickets, addTickets } = filterSlice.actions
export default filterSlice.reducer
