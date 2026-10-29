# TODO — Simulador de Prova AWS

- [x] **Estrutura Next.js para execução no navegador** — Criada a estrutura inicial em Next.js, preparada para executar o simulador no navegador, sem Supabase nesta primeira versão.
- [x] **Banco de 100 questões JSON demonstrativas** — Criado banco local em arquivo JSON com 100 questões AWS originais e demonstrativas, acompanhado de aviso claro de que não são questões oficiais da AWS.
- [x] **Tela inicial da prova** — Implementada apresentação da prova e ação para iniciar uma tentativa.
- [x] **Montagem aleatória da prova** — Cada tentativa seleciona e embaralha 70 questões a partir das 100 disponíveis.
- [x] **Cronômetro e encerramento automático** — Implementada contagem regressiva de 90 minutos e finalização automática quando o tempo acaba.
- [x] **Respostas e navegação** — Implementada apresentação de uma questão por vez com alternativas, navegação entre questões e registro das respostas selecionadas.
- [x] **Cálculo do resultado** — Implementado cálculo da percentagem de respostas corretas no final da tentativa.
- [x] **Aprovação e mensagem** — Aprovação configurada para pontuação igual ou superior a 75%; abaixo desse valor, a aplicação pede para reforçar os conhecimentos.
- [x] **Revisão da tentativa** — Implementada revisão das respostas, mostrando em cada questão a escolha do usuário e a resposta correta.
- [x] **Nova tentativa** — Implementada nova tentativa com nova seleção aleatória e nova ordem das questões.
