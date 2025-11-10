// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   ReactNode,
// } from "react";
// import { useRouter } from "next/navigation";

// // Tipagem mais clara do usuário
// type User = {
//   id: string;
//   email: string;
//   name: string;
//   profile: "CLIENT" | "TRANSPORTER" | "ADMIN";
//   // adicione outros campos que seu backend retorna
// };

// type AuthContextType = {
//   user: User | null;
//   isLoading: boolean;
//   error: string | null;
//   signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
//   signOut: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // ✅ Função para buscar o usuário autenticado usando o cookie do backend
//   const fetchUser = useCallback(async () => {
//     try {
//       const res = await fetch("/api/auth/me", {
//         credentials: "include", // ✅ envia os cookies automaticamente
//       });

//       if (!res.ok) {
//         setUser(null);
//         return;
//       }

//       const data = await res.json();
//       setUser(data);
//     } catch (err) {
//       console.error("Erro ao buscar usuário autenticado:", err);
//       setUser(null);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUser().finally(() => setIsLoading(false));
//   }, [fetchUser]);

//   // ✅ Login – envia email/senha para backend, backend cria cookie HttpOnly
//   const signIn = useCallback(
//     async (email: string, password: string, rememberMe?: boolean) => {
//       try {
//         setError(null);
//         setIsLoading(true);

//         const res = await fetch("/api/auth/login", {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password, rememberMe }),
//         });

//         if (!res.ok) {
//           const { message } = await res.json();
//           throw new Error(message || "Erro ao entrar.");
//         }

//         await fetchUser();
//         router.replace("/dashboard"); // ✅ redireciona após login
//       } catch (err: any) {
//         setError(err.message || "Erro inesperado");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [fetchUser, router],
//   );

//   // ✅ Logout – limpa cookie HttpOnly e estado global
//   const signOut = useCallback(async () => {
//     try {
//       await fetch("/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//       setUser(null);
//       router.replace("/login");
//     } catch (err) {
//       console.error("Erro ao sair:", err);
//     }
//   }, [router]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         error,
       
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
//   }
//   return context;
// }
