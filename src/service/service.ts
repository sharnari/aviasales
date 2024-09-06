export interface SearchIdResponce {
  searchId: string
}

export interface Segment {
  origin: string
  destination: string
  date: string
  duration: number
  stops: string[]
}

export interface Ticket {
  price: number
  carrier: string
  segments: Segment[]
  id: string
}

export interface TicketsResponse {
  tickets: Ticket[]
  stop: boolean
  status: number
}

export default class Service {
  baseURL = 'https://aviasales-test-api.kata.academy'
  ticketsURL = '/tickets'
  imagesURL = 'https://pics.avs.io/120/54'
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  wrapperQueryTryCatch = async (queryURL: string) => {
    try {
      const response = await fetch(queryURL, this.options)
      if (!response.ok) {
        throw new Error(`Could not fetch ${queryURL} received ${response.status}`)
      }
      const status = response.status
      const data = await response.json()
      return { ...data, status }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  getSearchId = async (): Promise<SearchIdResponce | undefined> => {
    const queryURL = `${this.baseURL}/search`
    return await this.wrapperQueryTryCatch(queryURL)
  }

  getTickets = async (searchId: string): Promise<TicketsResponse | undefined> => {
    const queryURL = `${this.baseURL}${this.ticketsURL}?searchId=${searchId}`
    return await this.wrapperQueryTryCatch(queryURL)
  }

  getImage = (name: string) => {
    return `${this.imagesURL}/${name}.png`
  }
}
