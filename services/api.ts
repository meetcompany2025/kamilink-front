"use client"

import Cookies from "js-cookie"

// ✅ Base URL da API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// ✅ Tipos de método HTTP suportados
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

// ✅ Interface que simula a estrutura de resposta do Axios
export interface ApiResponse<T = any> {
  data: T
  status: number
  ok: boolean
  headers?: Headers
}

// ✅ Configuração opcional para requisições (parecido com AxiosRequestConfig)
interface RequestConfig {
  headers?: Record<string, string>
  auth?: boolean
  noJson?: boolean // útil se quiser enviar FormData
}

// ✅ Função base de requisição
async function request<T = any>(
  url: string,
  method: HttpMethod,
  data?: any,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { headers: customHeaders = {}, auth = true, noJson = false } = config

  const token = Cookies.get("token")

  // ✅ Headers padrão
  const headers: HeadersInit = {
    ...(noJson ? {} : { "Content-Type": "application/json" }),
    ...customHeaders,
  }

  // ✅ Adiciona Authorization se necessário
  if (auth && token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // ✅ Monta opções do fetch
  const options: RequestInit = {
    method,
    headers,
    credentials: "omit", // não envia cookies automáticos
  }

  if (data) {
    options.body = noJson ? data : JSON.stringify(data)
  }

  // ✅ Faz requisição
  const res = await fetch(`${BASE_URL}${url}`, options)

  // ✅ Tenta converter a resposta em JSON (mesmo que erro)
  let responseData: any = null
  try {
    responseData = await res.json()
  } catch {
    responseData = null
  }

  // ✅ Retorna no formato Axios-like
  return {
    data: responseData,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  }
}

// ✅ API simplificada, compatível com AuthService
const api = {
  get: <T = any>(url: string, config?: RequestConfig) => request<T>(url, "GET", undefined, config),
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => request<T>(url, "POST", data, config),
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => request<T>(url, "PUT", data, config),
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) => request<T>(url, "PATCH", data, config),
  delete: <T = any>(url: string, config?: RequestConfig) => request<T>(url, "DELETE", undefined, config),
}

export default api
