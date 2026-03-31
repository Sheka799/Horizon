import axios, { type CreateAxiosDefaults } from 'axios'
import { ROUTES } from '../config'

const options: CreateAxiosDefaults = {
	baseURL: process.env.SERVER_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.response.use(
	response => response.data,
	async error => {
		if (error.response?.status === 401) {
			if (typeof window !== 'undefined') {
				window.location.href = ROUTES.AUTH.LOGIN
			}
		}

		return Promise.reject(error)
	}
)

export { axiosClassic, axiosWithAuth }
