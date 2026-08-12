# IBG Management

Frontend da plataforma de gestão da Comunidade Vida Nova, desenvolvido com Next.js, TypeScript e Tailwind CSS.

## Requisitos

- Node.js 20.9 ou superior
- npm

## Desenvolvimento

1. Copie `.env.example` para `.env.local` e ajuste as URLs da API.
2. Instale as dependências com `npm install`.
3. Inicie o ambiente local com `npm run dev`.
4. Acesse `http://localhost:3000`.

## Verificações

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run format:check`
- `npm run build`

## Organização

As rotas ficam em `src/app`, componentes genéricos em `src/components` e cada domínio em `src/features`. O dashboard atual usa dados demonstrativos tipados em `src/features/dashboard/data`; a futura integração deverá ocorrer por serviços, sem chamadas de API nos componentes visuais.

O tema respeita a preferência do sistema e pode ser alternado entre claro e escuro no cabeçalho. Os tokens de marca e de estado estão centralizados em `src/app/globals.css`.

## Contrato de autenticação

O frontend usa NextAuth com estratégia JWT. O token emitido pela API é mantido no JWT criptografado do NextAuth, armazenado em cookie `HttpOnly`, e não é exposto na sessão do cliente. `API_URL` é usada somente no servidor; `NEXT_PUBLIC_API_URL` permanece disponível para integrações públicas dos demais módulos.

Todas as respostas da API devem seguir o envelope `{ success, message, data }`. Os caminhos esperados estão centralizados em `src/features/auth/services/auth-endpoints.ts`. Login e autenticação social devem retornar em `data` o token como `accessToken` ou `token` e um objeto `user` com `id`, `name`, `email`, `status` e `permissions`.

Fluxos esperados da API:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/verify-email`
- `POST /auth/resend-verification-code`
- `POST /auth/forgot-password`
- `POST /auth/password-reset/validate`
- `POST /auth/password-reset`
- `POST /auth/logout`
- `POST /auth/oauth/{provider}` para trocar a credencial do Google ou Apple por uma sessão da plataforma

O dashboard exige uma sessão NextAuth cujo usuário esteja com status `ACTIVE`. Configure `NEXTAUTH_SECRET`, Google e Apple com as variáveis descritas em `.env.example`.

Callbacks que devem ser cadastrados nos provedores:

- Google: `{NEXTAUTH_URL}/api/auth/callback/google`
- Apple: `{NEXTAUTH_URL}/api/auth/callback/apple`

O `APPLE_CLIENT_SECRET` deve ser o client secret JWT gerado para o Service ID configurado na Apple.
