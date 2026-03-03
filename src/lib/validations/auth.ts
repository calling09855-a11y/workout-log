import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください"),
})

export const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, "表示名を入力してください")
    .max(20, "表示名は20文字以内で入力してください"),
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください"),
  confirmPassword: z
    .string()
    .min(1, "パスワード（確認）を入力してください"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
