// "use client";

// import Cookies from "js-cookie";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// async function request(
//   url: string,
//   method: HttpMethod,
//   data?: any,
//   auth: boolean = true
// ) {
//   const token = Cookies.get("token");

//   const headers: HeadersInit = {
//     "Content-Type": "application/json",
//   };

//   if (auth && token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const res = await fetch(`${BASE_URL}${url}`, {
//     method,
//     headers,
//     credentials: "omit",
//     body: data ? JSON.stringify(data) : undefined,
//   });

//   let responseData: any = null;
//   try {
//     responseData = await res.json();
//   } catch {
//     responseData = null;
//   }

//   // Mantém padrão axios: res.data, res.status
//   return {
//     data: responseData,
//     status: res.status,
//     ok: res.ok,
//   };
// }

// const api = {
//   get: (url: string, auth = true) => request(url, "GET", undefined, auth),
//   post: (url: string, data?: any, auth = true) => request(url, "POST", data, auth),
//   put: (url: string, data?: any, auth = true) => request(url, "PUT", data, auth),
//   patch: (url: string, data?: any, auth = true) => request(url, "PATCH", data, auth),
//   delete: (url: string, auth = true) => request(url, "DELETE", undefined, auth),
// };

// export default api;
