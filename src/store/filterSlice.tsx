/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import uniqid from 'uniqid'

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

export const fetchSearchId = createAsyncThunk<SearchIdResponce | undefined, void, { rejectValue: string }>(
  'store/fetchSearchId',
  async (_, { rejectWithValue }) => {
    try {
      const response = await service.getSearchId()
      return response
    } catch (error) {
      return rejectWithValue('Error fetching search ID')
    }
  }
)

export const fetchTickets = createAsyncThunk<void, string, { rejectValue: string }>(
  'store/fetchTickets',
  async (searchId, { dispatch, rejectWithValue }) => {
    let shouldContinue = true

    while (shouldContinue) {
      if (!navigator.onLine) {
        return rejectWithValue('No internet connection')
      }
      const queryURL = `${service.baseURL}${service.ticketsURL}?searchId=${searchId}`
      try {
        const response = await fetch(queryURL, service.options)
        if (response.status === 404) {
          return rejectWithValue('Error 404: Resource not found')
        }
        const data = await response.json()

        if (data) {
          const { tickets, stop } = data
          const ticketsWithId = tickets.map((ticket: any) => ({
            ...ticket,
            id: uniqid(ticket.carrier),
          }))
          dispatch(addTickets(ticketsWithId))
          if (stop) {
            shouldContinue = false
          }
        }
      } catch (error: any) {
        if (error.message.includes('404')) {
          shouldContinue = false
          return rejectWithValue('Error 404: Resource not found')
        }

        console.warn('Retrying request due to error:', error.message)
      }
    }
  }
)

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

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSearchId.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchSearchId.fulfilled, (state, action) => {
      if (action.payload) {
        state.searchId = action.payload.searchId
      } else {
        state.status = 'failed'
        state.error = 'Failed to fetch searchId'
      }
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

export const { handleCheckboxChange, handleRadioChange, showMoreTickets, addTickets, setError } = filterSlice.actions
export default filterSlice.reducer
