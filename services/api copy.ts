// // lib/api.ts
// import axios from "axios";
// import Cookies from "js-cookie";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
//   // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://ethical-vilhelmina-kamilink-831636e0.koyeb.app/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = Cookies.get("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

