# IBG Management

Frontend da plataforma de gestão da Comunidade Vida Nova, desenvolvido com Next.js, TypeScript e Tailwind CSS.

## Requisitos

- Node.js 20.9 ou superior
- npm

## Desenvolvimento

1. Copie `.env.example` para `.env.local` e ajuste a URL da API.
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
