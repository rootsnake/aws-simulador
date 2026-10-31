<div align="center">

# ☁️ AWS Exam Lab

**Cloud se aprende. Conhecimento se prova.**

Simulado prático de fundamentos AWS, com contagem regressiva, correção automática e revisão detalhada de cada resposta.

[![Abrir o simulador](https://img.shields.io/badge/▶_Abrir_o_simulador-0f172a?style=for-the-badge)](https://rootsnake.github.io/aws-simulador/)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=github&logoColor=white)

</div>

---

## ✨ Como funciona

| | |
|---|---|
| 🎲 **Questões aleatórias** | 70 questões sorteadas do banco a cada tentativa, com as alternativas embaralhadas |
| ⏱️ **Tempo de prova** | 90 minutos de contagem regressiva, com encerramento automático |
| 🗺️ **Mapa da prova** | Navegue entre as questões e veja o que já foi respondido |
| ✅ **Nota de corte** | Aprovação com 75% ou mais |
| 📖 **Revisão completa** | Gabarito e explicação de cada questão ao final |
| ☁️ **Banco na nuvem** | As questões vêm de uma Edge Function do Supabase, sem cadastro |

## 🧱 Stack

- **Next.js 16** com TypeScript, exportado como site estático
- **Supabase Edge Functions** para entregar o banco de questões
- **GitHub Actions + GitHub Pages** para build e deploy automáticos

## 🗂️ Estrutura

```
src/app/page.tsx                    Telas do simulado (intro, prova, resultado, revisão)
src/lib/exam.ts                     Busca das questões, sorteio, correção e cronômetro
src/lib/config.ts                   URL e chave pública (anon) do Supabase
supabase/functions/questions/       Cópia de referência da Edge Function
.github/workflows/deploy-pages.yml  Build e deploy no GitHub Pages
```

> A Edge Function roda no Supabase, não neste repositório. A pasta `supabase/` é apenas uma cópia de referência e é ignorada no build do site. Alterações na função precisam ser publicadas no painel do Supabase.

## 🚀 Rodando localmente

Requisitos: Node.js 22 ou superior e pnpm.

```bash
pnpm install
pnpm dev
```

O app abre em `http://localhost:3000`. Para gerar o site estático:

```bash
pnpm build
```

## 🌐 Deploy

O workflow em `.github/workflows/deploy-pages.yml` faz o build e publica a pasta `out/` a cada push na `main`.
Em **Settings → Pages → Source**, deixe selecionado **GitHub Actions**.

## 🗄️ Banco de questões

As questões ficam na tabela `questoes` do Supabase e são entregues pela Edge Function `questions`. Cada questão tem `id`, `category`, `question`, `options`, `answerIndex` (índice da alternativa correta, começando em zero) e `explanation`. São necessárias pelo menos 70 questões válidas para iniciar uma tentativa.

## ⚠️ Aviso

As questões são **originais e demonstrativas**. Elas **não são questões oficiais da AWS** e não representam uma certificação específica. As respostas são enviadas ao navegador, então o projeto serve para estudo e não para uma prova supervisionada. Ele não garante aprovação em nenhuma certificação.

---

<div align="center">
Feito para estudar cloud sem enrolação. ☁️
</div>
