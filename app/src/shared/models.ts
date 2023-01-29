export enum Category {
  baseball = "baseball",
  basketball = "basketball",
  football = "football",
  hockey = "hockey",
  soccer = "soccer",
}

export type Categories = {
  [key in Category]: {
    subcategories: string[]
    timeframes: string[]
  }
}

export interface Candidate {
  image: string
  text: string
}

export interface QueryResponse {
  results: Candidate[]
  term: string
}

export interface Vote {
  _id: string
  category: Category
  creatorId: string
  creatorName: string
  ballot: Candidate[]
  subcategory: string
  timeframe: string
}

export type VoteWIP = Omit<Vote, "_id">
