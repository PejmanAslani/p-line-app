import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { AxiosError, AxiosResponse } from "axios"
import PlineTools from "../services/PlineTools"

const axiosConfig = {
    BASE_URL: 'http://localhost',
    PORT: ':8080',
    TIMEOUT: 60000,
}

export const API = axios.create()

API.defaults.baseURL = axiosConfig.BASE_URL + axiosConfig.PORT

API.defaults.headers.common['Content-Type'] = 'application/json'

API.interceptors.request.use(function (config: any) {
    const token = PlineTools.getCookies('token');
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config;
});

const AxiosInterceptor = ({ children }: any) => {
    const navigate = useNavigate()
    useEffect(() => {

        const resInterceptor = (response: any) => {
            return response
        }

        const errInterceptor = (error: AxiosError) => {
            if (error.response?.status === 401) {
                console.log(error)
                return;
            }
            throw error
        }

        const interceptor = API.interceptors.response.use(resInterceptor, errInterceptor)

        return () => API.interceptors.response.eject(interceptor)

    }, [navigate])

    return children
}

export default API
export { AxiosInterceptor }