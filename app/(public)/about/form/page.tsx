// "use client";

// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// const formSchema = z.object({
//   pdfFile: z
//     .any()
//     .refine((files) => files?.length === 1, "PDF é obrigatório")
//     .refine(
//       (files) => files && files[0]?.type === "application/pdf",
//       "Apenas arquivos PDF"
//     ),
//   imageFile: z
//     .any()
//     .refine((files) => files?.length === 1, "Imagem é obrigatória")
//     .refine(
//       (files) =>
//         files &&
//         ["image/png", "image/jpeg"].includes(files[0]?.type),
//       "Apenas PNG ou JPG"
//     ),
// });

// type FormData = z.infer<typeof formSchema>;

// export default function ShadcnFileUploadForm() {
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       pdfFile: null,
//       imageFile: null,
//     },
//   });

//   const onSubmit = (data: FormData) => {
//     console.log("PDF:", data.pdfFile[0]);
//     console.log("Imagem:", data.imageFile[0]);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-6 max-w-md mx-auto"
//     >
//       {/* Upload PDF */}
//       <div>
//         <Label htmlFor="pdf-upload">Upload PDF</Label>
//         <Controller
//           name="pdfFile"
//           control={control}
//           render={({ field }) => (
//             <>
//               <Input
//                 id="pdf-upload"
//                 type="file"
//                 accept=".pdf"
//                 className="hidden"
//                 onChange={(e) => field.onChange(e.target.files)}
//               />
//               <label htmlFor="pdf-upload">
//                 <Button variant="outline">Selecionar PDF</Button>
//               </label>
//               {field.value && field.value[0] && (
//                 <p className="mt-2 text-gray-700">{field.value[0].name}</p>
//               )}
//             </>
//           )}
//         />
//         {errors.pdfFile && (
//           <p className="text-red-600 text-sm mt-1">Erro ao enviar pdf</p>
//           //   <p className="text-red-600 text-sm mt-1">{errors?.pdfFile}</p>
//         )}
//       </div>

//       {/* Upload Imagem */}
//       <div>
//         <Label htmlFor="image-upload">Upload Imagem</Label>
//         <Controller
//           name="imageFile"
//           control={control}
//           render={({ field }) => (
//               <>
//               <Input
//                 id="image-upload"
//                 type="file"
//                 accept="image/png, image/jpeg"
//                 className="hidden"
//                 onChange={(e) => field.onChange(e.target.files)}
//               />
//               <label htmlFor="image-upload">
//                 <Button variant="outline">Selecionar Imagem</Button>
//               </label>
//               {field.value && field.value[0] && (
//                   <p className="mt-2 text-gray-700">{field.value[0].name}</p>
//               )}
//             </>
//           )}
//         />
//         {errors.imageFile && (
//             <p className="text-red-600 text-sm mt-1">
//               <p className="text-red-600 text-sm mt-1">Erro ao enviar imagem</p>
//                 {/* {errors.imageFile.message} */}
//           </p>
//         )}
//       </div>

//       <Button type="submit" className="w-full">
//         Enviar
//       </Button>
//     </form>
//   );
// }






















// // "use client";

// // import { Controller, useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// // const formSchema = z
// //   .object({
// //     username: z
// //       .string()
// //       .min(3, "Username deve ter pelo menos 3 caracteres"),
// //     //   .regex(/^[a-zA-Z0-9]+$/, "Só pode conter letras e números"),

// //       email: z.email(),

// //     password: z
// //       .string()
// //       .min(6, "A senha deve ter pelo menos 6 caracteres"),
// //     //   .regex(/\d/, "A senha deve conter pelo menos 1 número"),

// //     confirm: z.string(),

// //     role: z.enum(["admin", "transporter", "client"], {
// //       errorMap: () => ({ message: "Selecione um tipo de usuário" }),
// //     }),
// //   })
// //   .refine((data) => data.password === data.confirm, {
// //     message: "As senhas não coincidem",
// //     path: ["confirm"],
// //   });

// // type FormData = z.infer<typeof formSchema>


// // export default function Form04 () {

// //     const {
// //         handleSubmit,
// //         register,
// //         control,
// //         formState: {errors}
// //     } = useForm<FormData>({
// //         resolver: zodResolver(formSchema),
// //         defaultValues: {
// //              role: "client", // ou "admin" se quiser um valor inicial
// //         }
// //     })

// //     const onSubbmit = (data: FormData) => {
// //         console.log('Datas', data)
// //     }
     
// //     return (
// //         <>
// //              <form onSubmit={handleSubmit(onSubbmit)} className="p-3 w-[500px] mx-auto mt-5 ">
// //                  <div className="space-y-3 w-full p-2">

// //                     <div>
// //                         <Input type="text" placeholder="Username" {...register("username")} />
// //                         {errors.username && (
// //                             <p className="text-red-600">
// //                                 Preencha o campo name
// //                             </p>
// //                         )}
// //                     </div>

// //                     <div>
// //                       <Controller
// //                         name="role"
// //                         control={control}
// //                         render={({ field }) => (
// //                             <Select
// //                             onValueChange={field.onChange} // quando o usuário muda o valor, atualiza o form
// //                             value={field.value || ""}            // mantém o valor sincronizado
// //                             >
// //                             <SelectTrigger className="w-[180px]">
// //                                 <SelectValue placeholder="Select a Role" />
// //                             </SelectTrigger>
// //                             <SelectContent>
// //                                 <SelectGroup>
// //                                 <SelectLabel>Roles</SelectLabel>
// //                                 <SelectItem value="admin">Admin</SelectItem>
// //                                 <SelectItem value="transporter">Transporter</SelectItem>
// //                                 <SelectItem value="client">Client</SelectItem>
// //                                 </SelectGroup>
// //                             </SelectContent>
// //                             </Select>
// //                         )}
// //                         />
// //                             {errors.role && (
// //                                 <p className="text-red-600">{errors.role.message}</p>
// //                             )}
// //                     </div>

// //                     <div>
// //                         <Input type="email" placeholder="E-mail" {...register("email")} />
// //                         {errors.email && (
// //                             <p className="text-red-600">
// //                                 {errors.email.message}
// //                             </p>
// //                         )}
// //                     </div>

// //                     <div>
// //                         <Input type="password" placeholder="Password" {...register("password")} />
// //                         {errors.password && (
// //                             <p className="text-red-600">
// //                                  {errors.password.message}
// //                             </p>
// //                         )}
// //                     </div>

// //                     <div>
// //                         <Input type="password" placeholder="Confirm Password" {...register("confirm")} />
// //                         {errors.confirm && (
// //                             <p className="text-red-600">
// //                                  {errors.confirm.message}
// //                             </p>
// //                         )}
// //                     </div>


// //                  <Button variant="outline" className="bg-blue-400 text-zinc-100">Enviar</Button>

// //                  </div>
// //              </form>
// //         </>
// //     )
// // }

// // // const formSchema = z.object({
// // //     name: z.string().min(3, 'Nome muito curto'),
// // //     email: z.email(),
// // //     age: z
// // //     .string()
// // //     .transform(val => Number(val))
// // //     .refine(num => !isNaN(num), "Age must be a number")
// // //     .refine(num => num >= 18, "Age cannot be minor 18")
// // // })

// // // type FormData = z.infer<typeof formSchema>

// // // export default function Form03 ()  {

// // //     const {
// // //         handleSubmit,
// // //         register,
// // //         formState: {errors}
// // //     } = useForm<FormData>({
// // //         resolver: zodResolver(formSchema)
// // //     })

// // //     const onSubmit = (data: FormData) => {
// // //         console.log('Dados: ', data)
// // //     }
// // //     return (
// // //         <>

// // //             <form onSubmit={handleSubmit(onSubmit)} className="p-3 w-[500px] mx-auto mt-5 ">
// // //                 <div className="space-y-3 w-full p-2">
// // //                 <Input type="text" placeholder="Name" {...register("name")} />
// // //                  {errors.name && <p className="text-red-700">Preencha o Campo</p>}

// // //                 <Input type="email" placeholder="E-mail" {...register("email")} />
// // //                 {errors.email && <p>Preencha o email</p>}

// // //                 <Input type="number" placeholder="Age" {...register("age")} />

// // //                 {errors.age && (<p className="text-red-700">{errors.age.message}</p>)}

// // //                  <Button variant="outline" className="bg-blue-400 text-zinc-100">Enviar</Button>

// // //                 </div>
// // //             </form>

// // //         </>
// // //     )
// // // }

// // // // 1) Criamos o schema Zod
// // // const formSchema = z.object({
// // //   nome: z.string().min(1, "O nome é obrigatório"),
// // // });

// // // // 2) TypeScript pega o tipo automaticamente
// // // type FormData = z.infer<typeof formSchema>;

// // // export default function Form01() {
// // //   const {
// // //     register,
// // //     handleSubmit,
// // //     formState: { errors }
// // //   } = useForm<FormData>({
// // //     resolver: zodResolver(formSchema), // 3) Conectando Zod ao formulário
// // //   });

// // //   const onSubmit = (data: FormData) => {
// // //     console.log("FORM DATA:", data);
// // //   };

// // //   return (
// // //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// // //       <div>
// // //         <input
// // //           {...register("nome")}
// // //           placeholder="Seu nome"
// // //           className="border p-2 rounded w-full"
// // //         />
// // //         {errors.nome && (
// // //           <p className="text-red-500 text-sm mt-1">
// // //             {errors.nome.message}
// // //           </p>
// // //         )}
// // //       </div>

// // //       <button
// // //         type="submit"
// // //         className="bg-blue-600 text-white px-4 py-2 rounded"
// // //       >
// // //         Enviar
// // //       </button>
// // //     </form>
// // //   );
// // // }
