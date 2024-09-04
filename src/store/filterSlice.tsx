import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import Service, { SearchIdResponce, Ticket, TicketsResponse } from '../service/service'

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
  // filteredTickets: Ticket[]
  displayedTicketsCount: number
}

const service: Service = new Service()

export const fetchSearchId = createAsyncThunk<SearchIdResponce | undefined>('store/fetchSearchId', async function () {
  return await service.getSearchId()
})

export const fetchTickets = createAsyncThunk<TicketsResponse | undefined, string>(
  'store/fetchTickets',
  async function (searchId) {
    let shouldContinue = true
    // let skokoRazBilZapros = 0
    const allTickets: Ticket[] = []
    while (shouldContinue) {
      const response = await service.getTickets(searchId)
      // skokoRazBilZapros++
      // console.log(skokoRazBilZapros)
      if (response) {
        const { tickets, stop } = response
        allTickets.push(...tickets)
        shouldContinue = !stop
      }
    }
    return { tickets: allTickets, stop: true }
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
  // filteredTickets: [],
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
      // filterSlice.caseReducers.applyFiltersAndSort(state)
    },

    handleRadioChange(state, action: PayloadAction<string>) {
      state.filterTickets = action.payload
      // filterSlice.caseReducers.applyFiltersAndSort(state)
    },

    // applyFiltersAndSort(state) {
    //   const activeFilters = state.filter.filter((arg) => arg.isCheck && arg.id !== 'all').map((arg) => arg.id)

    //   let filteredTickets = state.tickets
    //   if (activeFilters.length > 0 && !activeFilters.includes('all')) {
    //     filteredTickets = filteredTickets.filter((ticket: Ticket) => {
    //       const stops = ticket.segments[0].stops.length
    //       return (
    //         (activeFilters.includes('none') && stops === 0) ||
    //         (activeFilters.includes('one') && stops === 1) ||
    //         (activeFilters.includes('two') && stops === 2) ||
    //         (activeFilters.includes('three') && stops === 3)
    //       )
    //     })
    //   }
    //   filteredTickets.sort((ticket_1: Ticket, ticket_2: Ticket) => {
    //     if (state.filterTickets === 'самый дешевый') {
    //       return ticket_1.price - ticket_2.price
    //     } else if (state.filterTickets === 'самый быстрый') {
    //       const duration_1 = ticket_1.segments[0].duration + ticket_1.segments[1].duration
    //       const duration_2 = ticket_2.segments[0].duration + ticket_2.segments[1].duration
    //       return duration_1 - duration_2
    //     }
    //     return 0
    //   })
    //   if (activeFilters.length === 0 && !state.filter.some((arg) => arg.isCheck)) {
    //     state.filteredTickets = []
    //   } else {
    //     state.filteredTickets = filteredTickets
    //   }
    // },

    showMoreTickets(state) {
      state.displayedTicketsCount += 5
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
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      if (action.payload) {
        state.tickets = action.payload.tickets
        // filterSlice.caseReducers.applyFiltersAndSort(state)
      }
      state.status = 'tickets succeeded'
    })
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.status = 'tickets failed'
      state.error = action.error.message || 'Failed to fetch tickets'
    })
  },
})

export const { handleCheckboxChange, handleRadioChange, showMoreTickets } = filterSlice.actions
export default filterSlice.reducer
