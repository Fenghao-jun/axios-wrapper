import axios, { AxiosResponse } from 'axios'
import type { AxiosInstance } from 'axios'
import type { IMRequestConfig, InterceptorConfig } from './type'

const DEFAULT_LOADING = false

export class MRequest {
  instance: AxiosInstance
  interceptors?: InterceptorConfig
  showLoading?: boolean

  constructor(config: IMRequestConfig) {
    //创建实例
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
    this.showLoading = config.showLoading ?? DEFAULT_LOADING

    //全部实例都安装的拦截器
    this.instance.interceptors.request.use(
      (config) => {

        return config
      },
      (err) => {
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        return res
      },
      (err) => {
        return err
      }
    )

    //注册拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
  }

  //实例中的传入的config为AxiosRequestConfig类型
  //把实例改成拓展后的类型，这样可以方便我们对一些特殊请求进行数据处理
  request<T>(config: IMRequestConfig<T>): Promise<T> {
    return new Promise((resolve) => {

      this.instance.request<T>(config).then((response) => {
        //请求成功后的拦截
        if (config.interceptors?.responseInterceptor) {
          response = config.interceptors.responseInterceptor(response)
          this.showLoading = DEFAULT_LOADING
        }
        resolve(response.data)
      })
    })
  }

  get<T = any>(config: IMRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: IMRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

  delete<T = any>(config: IMRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: IMRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}

