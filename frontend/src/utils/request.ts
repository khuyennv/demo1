import axios from 'axios';

import { baseURL } from './constants';

const request = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
)

export default request

