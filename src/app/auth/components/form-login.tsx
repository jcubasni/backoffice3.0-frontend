import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "@tanstack/react-router"
import { Image } from "@unpic/react"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useLogin } from "@/app/auth/hooks/useAuthService"
import { authSchema, SAuth } from "@/app/auth/schemas/auth.schema"
import { ButtonForm } from "@/shared/components/form/button-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { Routes } from "@/shared/lib/routes"

export const FormLogin = () => {
  const [showPassword, setShowPassword] = useState<"text" | "password">(
    "password",
  )
  const login = useLogin()
  const form = useForm<SAuth>({ resolver: zodResolver(authSchema) })

  const onSubmit = (data: SAuth) => {
    login.mutate({ username: data.username, password: data.password })
  }

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="items-center gap-6 sm:w-96"
    >
      <h1 className="border-blue-950/40 border-b pb-2 font-bold text-3xl text-blue-950 dark:border-secondary-foreground dark:text-secondary-foreground ">
        Inicio de sesión
      </h1>
      <Image
        src="/img/isi logo new.png"
        alt="logo"
        height={160}
        width={160}
        className="mb-12"
        
        
      />
      <InputForm label="Usuario" name="username" classContainer="w-full" />
      <InputForm
        label="Contraseña"
        name="password"
        type={showPassword}
        classContainer="w-full"
        icon={showPassword === "password" ? Eye : EyeOff}
        iconClick={() =>
          setShowPassword((prev) => (prev === "password" ? "text" : "password"))
        }
      />
      <ButtonForm
        type="submit"
        className="w-full"
        variant="default"
        text="Iniciar sesión"
        isPending={login.isPending}
      />
      <Link
        to={Routes.Home}
        className="text-foreground text-sm hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </FormWrapper>
  )
}
