// import api from './api';
// import { LoginDto, RegisterDto, AuthResponse } from '../types/auth';

// export const AuthService = {
//   login: async (data: LoginDto): Promise<AuthResponse> => {
//     console.log(data);
//     const res = await api.post('/auth/login', data);
//     return res.data;
//   },

//   register: async (data: RegisterDto) => {
//     const res = await api.post('/users', data); // endpoint de registro
//     return res.data;
//   },

//   me: async (token: string) => {

//     try {
//       const res = await api.get("/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res.data;
//     } catch (err) {
//       return null;
//     }
//   },

//   logout: async () => {
//     const res = await api.post('/auth/logout'); 
//     return res.data;
//   },

//   forgotPassword: async (email: string) => {
//     const res = await api.post('/auth/forgot-password',{email}); 
//     return res.data;
//   },

//   changePassword: async (data: any) => {
//     const res = await api.patch('/auth/reset-password', data); 
//     return res.data;
//   },
// };
