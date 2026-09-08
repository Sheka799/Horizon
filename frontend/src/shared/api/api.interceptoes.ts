import axios, { type CreateAxiosDefaults, type InternalAxiosRequestConfig } from 'axios'
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

function attachCsrfToken(config: InternalAxiosRequestConfig) {
	if (typeof document === 'undefined') {
		return config
	}

	const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

	if (match) {
		config.headers.set('X-CSRF-Token', decodeURIComponent(match[1]))
	}

	return config
}

axiosClassic.interceptors.request.use(attachCsrfToken)
axiosWithAuth.interceptors.request.use(attachCsrfToken)

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
