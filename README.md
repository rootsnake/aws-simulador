# AWS Exam Lab

Um simulador demonstrativo de fundamentos AWS, feito com Next.js e TypeScript. O banco inicial contém 100 perguntas originais de estudo. Elas **não são questões oficiais da AWS** e não representam uma prova ou certificação específica.

## O que já funciona

- Embaralha o banco e seleciona 70 perguntas em cada tentativa.
- Executa a prova com contagem regressiva de 90 minutos e encerramento automático.
- Permite responder e navegar pelas questões.
- Calcula a porcentagem, considera 75% ou mais como aprovação e mostra a revisão com gabarito e explicações.
- Mantém banco e lógica localmente, sem Supabase ou cadastro.

## Requisitos e execução

- Node.js 22 ou compatível.
- pnpm 11.25.0, fixado no campo `packageManager`.

```bash
pnpm install
pnpm dev
```

A aplicação ficará disponível em `http://localhost:3000`. Para gerar o site estático:

```bash
pnpm build
```

O Next.js exporta a aplicação para `out/`.

## Editar o banco de questões

O arquivo `src/data/aws-questions.json` contém cada questão com `id`, `category`, `question`, `options`, `answerIndex` e `explanation`. `answerIndex` é o índice, começando em zero, da alternativa correta. Mantenha pelo menos 70 questões válidas para iniciar uma tentativa.

## GitHub Pages

O projeto está preparado para exportação estática. O workflow em `.github/workflows/deploy-pages.yml` constrói e publica `out/` usando GitHub Actions. No repositório, selecione **Settings → Pages → Build and deployment → GitHub Actions**. Para um site de projeto, o workflow configura automaticamente o caminho `/nome-do-repositorio`; para um repositório `usuario.github.io`, usa a raiz.

## Limites desta primeira versão

As questões e o gabarito são enviados ao navegador, portanto este app serve para estudo, não para aplicar uma prova segura ou supervisionada. O progresso não é sincronizado entre dispositivos e pode ser perdido ao atualizar a página. Para guardar histórico, autenticar usuários ou ocultar respostas, será necessário adicionar uma camada de servidor e, se desejado, banco de dados.
