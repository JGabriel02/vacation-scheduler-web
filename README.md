# Vacation Scheduler — Frontend

Interface web do sistema **Vacation Scheduler**, desenvolvida para permitir que funcionários cadastrem e acompanhem seus períodos de férias, enquanto gerentes visualizam as férias dos integrantes de sua equipe.

O frontend consome uma API REST desenvolvida com Java e Spring Boot, utilizando autenticação JWT e controle de acesso baseado no perfil do usuário.

## Funcionalidades

### Funcionário

* Cadastro de conta utilizando o código do gerente
* Login com autenticação JWT
* Cadastro de períodos de férias
* Visualização das próprias férias
* Cálculo automático da quantidade de dias
* Exclusão de períodos futuros
* Confirmação de exclusão por modal
* Indicadores de férias:

  * agendadas
  * em andamento
  * concluídas
* Resumo com total de períodos e dias cadastrados

### Gerente

* Cadastro de conta
* Geração automática de código de gerente
* Cópia do código para a área de transferência
* Login com autenticação JWT
* Visualização das férias da equipe
* Busca de funcionários por nome
* Filtro de férias por status
* Resumo com:

  * número de funcionários
  * períodos cadastrados
  * próxima data de férias
  * Em férias agora

### Recursos gerais

* Rotas protegidas por perfil
* Redirecionamento automático de usuários autenticados
* Página 404 personalizada
* Mensagens de sucesso e erro em pop-ups
* Tratamento centralizado de erros da API
* Sessão armazenada no navegador
* Layout responsivo para computador, tablet e celular
* Modal personalizado de confirmação

## Tecnologias

* React
* TypeScript
* Vite
* React Router DOM
* Axios
* Lucide React
* Sonner
* CSS

## API

O frontend utiliza a seguinte API:

```text
https://vacationschedulerapplication.onrender.com
```

Principais endpoints utilizados:

| Método   | Endpoint              | Descrição                                  |
| -------- | --------------------- | ------------------------------------------ |
| `POST`   | `/auth/login`         | Realiza o login                            |
| `POST`   | `/managers`           | Cadastra um gerente                        |
| `POST`   | `/employees`          | Cadastra um funcionário                    |
| `POST`   | `/vacations`          | Cadastra um período de férias              |
| `GET`    | `/vacations/me`       | Lista as férias do funcionário autenticado |
| `DELETE` | `/vacations/{id}`     | Exclui um período de férias                |
| `GET`    | `/managers/vacations` | Lista as férias da equipe do gerente       |

## Pré-requisitos

Antes de iniciar, instale:

* Node.js 18 ou superior
* npm
* Git

Para conferir as versões instaladas:

```bash
node --version
npm --version
git --version
```

## Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO_FRONTEND
```

Entre na pasta do projeto:

```bash
cd vacation-scheduler-frontend
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=https://vacationschedulerapplication.onrender.com
```

Durante o desenvolvimento local com o backend executando na máquina, também é possível utilizar:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Após modificar o `.env`, reinicie o servidor do Vite.

## Executando o projeto

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível normalmente em:

```text
http://localhost:5173
```

## Scripts disponíveis

```bash
npm run dev
```

Executa o projeto em modo de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção na pasta `dist`.

```bash
npm run preview
```

Executa localmente a versão gerada para produção.

```bash
npm run lint
```

Executa a análise do código com ESLint.

## Estrutura do projeto

```text
src/
├── api/
│   └── api.ts
├── components/
│   ├── ConfirmDialog.tsx
│   ├── EmployeeRoute.tsx
│   ├── ManagerRoute.tsx
│   └── PublicOnlyRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── EmployeeDashboardPage.tsx
│   ├── EmployeeRegisterPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ManagerDashboardPage.tsx
│   ├── ManagerRegisterPage.tsx
│   └── NotFoundPage.tsx
├── services/
│   ├── authService.ts
│   ├── authStorage.ts
│   ├── employeeService.ts
│   ├── managerService.ts
│   └── vacationService.ts
├── utils/
│   ├── apiError.ts
│   ├── date.ts
│   └── jwt.ts
├── App.tsx
├── index.css
├── main.tsx
└── types.ts
```

## Autenticação

Após o login, a API retorna os dados do usuário e um token JWT.

Exemplo de resposta:

```json
{
  "id": 1,
  "nome": "João Gabriel",
  "email": "joao@email.com",
  "role": "EMPLOYEE",
  "managerCode": null,
  "token": "TOKEN_JWT"
}
```

O token é armazenado no navegador e enviado automaticamente pelo Axios:

```http
Authorization: Bearer TOKEN_JWT
```

O frontend também verifica a data de expiração presente no token.

Quando a sessão não é válida, o usuário é direcionado novamente para a tela de login.

## Controle de acesso

A aplicação possui três tipos de proteção de rotas.

### `EmployeeRoute`

Permite acesso somente a usuários com perfil:

```text
EMPLOYEE
```

Rota principal:

```text
/dashboard
```

### `ManagerRoute`

Permite acesso somente a usuários com perfil:

```text
MANAGER
```

Rota principal:

```text
/manager
```

### `PublicOnlyRoute`

Impede que usuários já autenticados acessem páginas como:

```text
/
/login
/register/employee
/register/manager
```

Usuários autenticados são redirecionados automaticamente para o dashboard correspondente ao seu perfil.

## Tratamento de erros

Os erros da API são tratados de forma centralizada pelo arquivo:

```text
src/utils/apiError.ts
```

A aplicação tenta exibir primeiro a mensagem retornada pelo backend. Quando não existe uma mensagem específica, utiliza uma resposta baseada no status HTTP.

Exemplos:

* `400`: dados inválidos
* `401`: autenticação inválida ou expirada
* `403`: usuário sem permissão
* `404`: recurso não encontrado
* `409`: conflito de dados
* `500`: erro interno do servidor
* `503`: serviço temporariamente indisponível

As mensagens são apresentadas utilizando pop-ups da biblioteca Sonner.

## Regras de férias

O backend é responsável pela validação das regras do sistema, como:

* a data inicial deve ser futura
* a data final não pode ser anterior à inicial
* o funcionário deve possuir pelo menos um ano de admissão
* as férias devem possuir 10, 20 ou 30 dias
* o total por ciclo não pode ultrapassar 30 dias
* os períodos podem ser divididos em 20 e 10 dias
* períodos do mesmo funcionário não podem se sobrepor
* férias já iniciadas não podem ser excluídas

O frontend apresenta ao usuário as mensagens retornadas pela API quando alguma regra não é atendida.

## Status das férias

Os períodos são classificados no frontend de acordo com as datas:

```text
SCHEDULED
```

Férias com data inicial futura.

```text
IN_PROGRESS
```

Férias em andamento.

```text
COMPLETED
```

Férias já finalizadas.

## Página 404

Rotas inexistentes exibem uma página personalizada com opções para:

* voltar à página anterior
* voltar para a página inicial
* voltar para o dashboard, quando o usuário estiver autenticado

Exemplo para teste:

```text
http://localhost:5173/rota-inexistente
```

## CORS

Durante o desenvolvimento, o backend deve permitir a origem:

```text
http://localhost:5173
```

A API está preparada para receber as origens autorizadas por variável de ambiente:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Quando o frontend for publicado, a URL de produção poderá ser adicionada:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://seu-frontend.com
```

Não utilize uma barra `/` no final da origem.

Correto:

```text
https://seu-frontend.com
```

Incorreto:

```text
https://seu-frontend.com/
```

## Build de produção

Para gerar o projeto:

```bash
npm run build
```

Os arquivos finais serão criados em:

```text
dist/
```

Para testar o build localmente:

```bash
npm run preview
```

## Melhorias futuras

* Publicação do frontend
* Recuperação de senha
* Aprovação ou rejeição de férias pelo gerente
* Edição de períodos de férias
* Paginação da listagem
* Notificações por e-mail
* Relatórios e exportação de dados
* Testes automatizados
* Tema escuro
* Atualização do perfil do usuário

## Backend

O backend deste projeto foi desenvolvido com:

* Java 21
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* PostgreSQL
* Neon
* Docker
* Render

## Autor

Desenvolvido por **João Gabriel**.
