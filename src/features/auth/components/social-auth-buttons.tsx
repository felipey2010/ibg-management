import { Button } from "@/components/ui/button";
import { getOAuthUrl } from "@/features/auth/services/auth-client.service";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export function SocialAuthButtons({ action = "Entrar" }: Readonly<{ action?: "Entrar" | "Cadastrar" }>) {
  return (
    <div className="grid gap-3">
      <Button variant="outline" size="lg" nativeButton={false} render={<a href={getOAuthUrl("google")} />}>
        <FcGoogle aria-hidden="true" size={16} />
        {action} com Google
      </Button>
      <Button variant="outline" size="lg" nativeButton={false} render={<a href={getOAuthUrl("apple")} />}>
        <FaApple aria-hidden="true" size={16} />
        {action} com Apple
      </Button>
    </div>
  );
}
