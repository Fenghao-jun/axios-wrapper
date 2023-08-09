import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface InterceptorConfig<T = any> {
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestInterceptorCatch?: (config: any) => any
  responseInterceptor?: (config: AxiosResponse<T>) => AxiosResponse<T>
  responseInterceptorCatch?: (config: any) => any
}

interface IMRequestConfig<T = any> extends AxiosRequestConfig {
  interceptors?: InterceptorConfig<T>
  showLoading?: boolean
}

export { InterceptorConfig, IMRequestConfig }
