import { Image } from "@/adpters/image";
import { Link } from "@/adpters/link";
import { apiV1 } from "@/lib/api";
import { useAuth } from "@/providers/auth";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label, Separator } from "package-gbg-components";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { z } from "zod";

export default function LoginPage() {
  return <SignInPageContent />
}

type Props = { allowLoginGovbr?: boolean; };

export function SignInPageContent({ allowLoginGovbr = false }: Props) {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="flex-col justify-center space-y-6" style={{ maxWidth: 350 }}>
        <div className=" text-center flex flex-col items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={170} height={50} />
          <p>Sistema de gerenciamento de documentos</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LoginWithMailButton />

          <div className="relative w-full flex items-center justify-center my-4">
            <p className="absolute bg-background px-2 rounded-full text-xs text-muted-foreground/50">OU</p>
            <div className="w-full"><Separator /></div>
          </div>

          {allowLoginGovbr && <LoginWithGovbrButton />}

          <p>Não tem uma conta? <Link href={"/sign-up"} className="font-medium hover:underline text-blue-600">Registrar-se</Link></p>
        </div>
        <p className="text-center text-muted-foreground">
          Ao clicar em entrar, você concorda com nossos <a className="text-primary underline">Termos de uso</a> e <a className="text-primary underline">Política de privacidade</a>.
        </p>
      </div>
    </div>
  );
}

const LoginWithMailButton = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const callback = sp.get("callback");
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();

  const schema = z.object({
    email: z.string().min(1, "Email é obrigatório"),
    // password: z.string().min(1, "Senha é obrigatória"),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  // const loginMutation = useMutation({
  //   mutationKey: ["login"],
  //   mutationFn: async ({ email, password }: SignInProps) => {

  //   },
  //   throwOnError: false,
  //   // retry: (error) => error.,
  //   // retryDelay: (attempt) => attempt * 1000,
  //   async onSuccess(data) {
  //     setCookie(undefined, "access-token", data.accessToken, {
  //       maxAge: 60 * 60 * 1,
  //       path: "/",
  //     });
  //     setCookie(undefined, "refresh-token", data.refreshToken, {
  //       maxAge: 60 * 60 * 24 * 30,
  //       path: "/",
  //     });
  //     setCookie(undefined, "access-token-expires-in", new Date(data.accessTokenExpiresIn).getTime().toString(), {
  //       path: "/",
  //     });
  //     setInitialized(true);
  //     redirect("/home");
  //   },
  //   onError(error) {
  //     // alert("falhou: " + error.message)
  //   }
  // });

  const authWithEmail = async ({ email, password }: { email: string; password: string; }) => {
    try {
      const { data } = await apiV1.post("/auth/sign-in", { email, password });
      login(data);
      navigate(callback ?? "/");
    } catch {
      // Trate erro aqui se precisar
    }
  };

  return (
    <form className="flex-1 w-full flex flex-col" onSubmit={form.handleSubmit(authWithEmail)}>
      <Label>Login</Label>
      <Input autoFocus autoCorrect="off" autoCapitalize="off" type="email" {...form.register("email")} />
      {/* <Label>Senha</Label>
      <Input autoCorrect="off" autoCapitalize="off" type="password" {...form.register("password")} /> */}
      <Button className="w-full mt-2" type="submit" isLoading={isPending}>Entrar</Button>
    </form>
  );
};

const LoginWithGovbrButton = () => {
  return <Button className="w-full bg-blue-600 text-white">Entrar com GOV.BR</Button>;
};
