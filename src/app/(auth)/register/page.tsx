"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/AuthContext"
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth"
import { getFirebaseErrorMessage } from "@/lib/firebase/errors"
import { initializeExercises } from "@/lib/firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError("")
    setIsLoading(true)
    try {
      const user = await signUp(data.email, data.password, data.displayName)
      await initializeExercises(user.uid)
      router.push("/")
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      setError(getFirebaseErrorMessage(firebaseError.code || ""))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">新規登録</CardTitle>
          <CardDescription>アカウントを作成してトレーニングを始めよう</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">表示名</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="トレーニー太郎"
                {...register("displayName")}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="8文字以上"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">パスワード（確認）</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="パスワードを再入力"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登録中..." : "アカウントを作成"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              ログインはこちら
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
