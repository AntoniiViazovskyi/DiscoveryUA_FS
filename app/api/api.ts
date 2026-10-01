import axios from 'axios'

export const api = axios.create({
  baseURL: `${process.env.BACKEND_ORIGIN}/api`,
  withCredentials: true,
})