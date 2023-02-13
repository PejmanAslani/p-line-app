import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import PlineTools from "../services/PlineTools"

export const API = axios.create();
API.defaults.baseURL = "http://localhost:8080";
API.defaults.timeout = 60000;
API.defaults.headers.common['Content-Type'] = 'application/json'
const token = PlineTools.getCookies('token');
API.interceptors.request.use(function (config: any) {
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config;
});

const AxiosInterceptor = ({ children }: any) => {
    const navigate = useNavigate()
    useEffect(() => {
        const resInterceptor = (response: any) => {
            if (response.status === 401) {

                navigate('/login')
            }
            return response
        }
        const errInterceptor = (error: any) => {
            return error
        }
        const interceptor = API.interceptors.response.use(resInterceptor, errInterceptor)

        return () => API.interceptors.response.eject(interceptor)

    }, [navigate])

    return children
}
export default API
export { AxiosInterceptor }
