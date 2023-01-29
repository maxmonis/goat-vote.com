import {useQuery} from "react-query"

import axios from "axios"

import {Vote} from "../shared/models"

export default function useVotes(params?: object) {
  const {data, isLoading} = useQuery(["vote", params], () => fetchVotes(params))

  return {data, isLoading}
}

async function fetchVotes(params?: object) {
  const {data} = await axios.get<Vote[]>("/api/vote", {params})

  return data
}
