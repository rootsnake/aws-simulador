"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  calculateScore,
  createExam,
  formatTime,
  fetchQuestionsFromSupabase,
  type Answers,
  type Question,
} from "@/lib/exam";

const EXAM_SIZE = 70;
const EXAM_SECONDS = 90 * 60;
const LETTERS = ["A", "B", "C", "D"];

type Screen = "intro" | "exam" | "result" | "review";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M10.2 25.8a7.1 7.1 0 0 1 .9-14.1A10 10 0 0 1 29.8 15a5.7 5.7 0 0 1-.7 11.3H10.2Z" />
        <path d="m14.4 21.2 4 4 7.7-8.2" />
      </svg>
    </span>
  );
}

function formatDuration(seconds: number) {
  const elapsed = EXAM_SECONDS - seconds;
  const minutes = Math.floor(elapsed / 60);
  return `${minutes} min`;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState(true);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_SECONDS);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const timerIdRef = useRef<number | null>(null);

  // Busca o banco de questões da Edge Function do Supabase ao carregar a página
  useEffect(() => {
    async function loadBank() {
      try {
        const questions = await fetchQuestionsFromSupabase();
        setQuestionBank(questions);
      } catch (err) {
        console.error("Erro ao carregar banco de questões da nuvem:", err);
      } finally {
        setIsLoadingBank(false);
      }
    }
    loadBank();
  }, []);

  useEffect(() => {
    if (screen !== "exam") return;
    timerIdRef.current = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => {
      if (timerIdRef.current !== null) window.clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    };
  }, [attemptNumber, screen]);

  useEffect(() => {
    if (screen === "exam" && remainingSeconds === 0 && timerIdRef.current !== null) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, [remainingSeconds, screen]);

  const currentQuestion = examQuestions[currentIndex];
  const score = useMemo(
    () => calculateScore(examQuestions, answers),
    [answers, examQuestions],
  );
  const answeredCount = examQuestions.reduce(
    (total, question) => total + (answers[question.id] !== undefined ? 1 : 0),
    0,
  );

  function startExam() {
    if (questionBank.length === 0) {
      alert("O banco de questões ainda está vazio ou carregando. Tente novamente em instantes.");
      return;
    }
    try {
      setExamQuestions(createExam(questionBank, EXAM_SIZE));
      setAnswers({});
      setCurrentIndex(0);
      setRemainingSeconds(EXAM_SECONDS);
      setAttemptNumber((attempt) => attempt + 1);
      setScreen("exam");
    } catch (err: any) {
      alert(err.message || "Erro ao gerar o simulado.");
    }
  }

  function chooseAnswer(optionIndex: number) {
    if (!currentQuestion) return;
    setAnswers((current) => ({ ...current, [currentQuestion.id]: optionIndex }));
  }

  function moveTo(index: number) {
    setCurrentIndex(Math.min(Math.max(index, 0), examQuestions.length - 1));
  }

  if (screen === "intro") {
    return (
      <main className="site-shell intro-shell">
        <Header />
        <section className="intro-layout">
          <div className="intro-copy">
            <p className="eyebrow"><span className="pulse-dot" /> LABORATÓRIO DE PREPARAÇÃO</p>
            <h1>Cloud se aprende.<br /><span>Conhecimento se prova.</span></h1>
            <p className="intro-description">
              Um simulado prático conectado à nuvem para revisar fundamentos AWS, treinar sob pressão de tempo e descobrir onde focar os próximos estudos.
            </p>
            <div className="intro-actions">
              <button 
                className="button button-primary button-large" 
                onClick={startExam}
                disabled={isLoadingBank}
              >
                {isLoadingBank ? "Conectando à nuvem..." : "Iniciar simulado"} <span aria-hidden="true">↗</span>
              </button>
              <span className="small-note">Sem cadastro. Dados dinâmicos via Supabase.</span>
            </div>
            <div className="trust-note">
              <span className="info-icon" aria-hidden="true">i</span>
              <p>Questões originais e demonstrativas — <strong>não são questões oficiais da AWS</strong> nem representam uma certificação específica.</p>
            </div>
          </div>
          <aside className="exam-card" aria-label="Formato do simulado">
            <div className="card-topline"><span>FORMATO DA PROVA</span><span className="live-pill">{isLoadingBank ? "CARREGANDO" : "PRONTO"}</span></div>
            <div className="card-emblem" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <BrandMark />
              <span className="emblem-star star-one">✳</span><span className="emblem-star star-two">✳</span>
            </div>
            <div className="card-title-row"><div><p className="card-kicker">AWS EXAM LAB</p><h2>Fundamentos<br />de cloud</h2></div><span className="card-number">01</span></div>
            <div className="stat-list">
              <StatRow index="01" label="Banco de questões" value={isLoadingBank ? "..." : String(questionBank.length)} detail="perguntas na nuvem" />
              <StatRow index="02" label="Por tentativa" value={String(EXAM_SIZE)} detail="selecionadas aleatoriamente" />
              <StatRow index="03" label="Tempo de prova" value="90 min" detail="contagem regressiva" />
            </div>
            <div className="pass-mark"><span>NOTA DE APROVAÇÃO</span><strong>75%</strong><span className="pass-bar"><i /></span></div>
          </aside>
        </section>
        <Footer />
      </main>
    );
  }

  if (screen === "result" || (screen === "exam" && remainingSeconds === 0)) {
    const scoreStyle = { "--score": `${score.percentage}%` } as CSSProperties;
    return (
      <main className="site-shell results-shell">
        <Header />
        <section className="results-wrap">
          <div className="results-heading">
            <p className="eyebrow"><span className="pulse-dot" /> TENTATIVA CONCLUÍDA</p>
            <h1>{score.passed ? "Boa! Você passou." : "É hora de reforçar."}</h1>
            <p>{score.passed ? "Você atingiu a nota de corte deste simulado demonstrativo." : "Revise os temas abaixo e tente novamente com um novo conjunto de questões."}</p>
          </div>
          <div className="results-grid">
            <section className="score-card">
              <div className="score-ring" style={scoreStyle}><div><strong>{score.percentage}<small>%</small></strong><span>pontuação</span></div></div>
              <p className={`status-chip ${score.passed ? "status-pass" : "status-review"}`}><span />{score.passed ? "APROVADO · CORTE 75%" : "ABAIXO DO CORTE · 75%"}</p>
              <h2>{score.passed ? "Conhecimento validado." : "Você precisa reforçar seus conhecimentos."}</h2>
              <p className="score-support">{score.passed ? "Continue praticando para consolidar o aprendizado." : "Revise as explicações das questões e faça outra tentativa quando estiver pronto."}</p>
            </section>
            <section className="metrics-card" aria-label="Resumo do resultado">
              <div className="metrics-title"><span>RESUMO DA TENTATIVA</span><span className="metric-spark">↗</span></div>
              <div className="metric-row"><span>Respostas corretas</span><strong>{score.correct}<small> / {score.total}</small></strong></div>
              <div className="metric-row"><span>Respostas incorretas ou em branco</span><strong>{score.total - score.correct}<small> / {score.total}</small></strong></div>
              <div className="metric-row"><span>Tempo utilizado</span><strong>{formatDuration(remainingSeconds)}</strong></div>
              <div className="metric-row"><span>Nota mínima</span><strong>75%</strong></div>
              <div className="result-actions">
                <button className="button button-primary" onClick={() => setScreen("review")}>Revisar respostas <span aria-hidden="true">→</span></button>
                <button className="button button-secondary" onClick={startExam}>Tentar novamente <span aria-hidden="true">↻</span></button>
              </div>
            </section>
          </div>
          <p className="fine-print">Resultado de estudo calculado no navegador via Supabase. Este simulado não é oficial e não garante aprovação em certificações.</p>
        </section>
        <Footer />
      </main>
    );
  }

  if (screen === "review") {
    return (
      <main className="site-shell review-shell">
        <Header />
        <section className="review-wrap">
          <div className="review-heading">
            <button className="text-back" onClick={() => setScreen("result")}>← Voltar ao resultado</button>
            <p className="eyebrow"><span className="pulse-dot" /> REVISÃO DETALHADA</p>
            <h1>Veja o raciocínio por trás de cada resposta.</h1>
            <p>Corretas em verde. Respostas incorretas ou não respondidas em âmbar.</p>
          </div>
          <div className="review-summary"><strong>{score.correct}<span> / {score.total}</span></strong><span>respostas corretas</span><button className="button button-secondary" onClick={startExam}>Nova tentativa <span aria-hidden="true">↻</span></button></div>
          <div className="review-list">
            {examQuestions.map((question, index) => {
              const selected = answers[question.id];
              const isCorrect = selected === question.answerIndex;
              return (
                <article className={`review-question ${isCorrect ? "review-correct" : "review-incorrect"}`} key={question.id}>
                  <div className="review-question-top"><span>QUESTÃO {String(index + 1).padStart(2, "0")} <i>·</i> {question.category}</span><strong>{isCorrect ? "CORRETA" : selected === undefined ? "EM BRANCO" : "INCORRETA"}</strong></div>
                  <h2>{question.question}</h2>
                  <div className="review-options">
                    {question.options.map((option, optionIndex) => {
                      const isAnswer = optionIndex === question.answerIndex;
                      const isSelected = optionIndex === selected;
                      return <div className={`review-option ${isAnswer ? "is-answer" : ""} ${isSelected && !isAnswer ? "is-wrong-choice" : ""}`} key={option}>
                        <span className="option-letter">{LETTERS[optionIndex]}</span><span>{option}</span>
                        {isSelected && isAnswer && <b>SUA RESPOSTA · GABARITO</b>}
                        {isAnswer && !isSelected && <b>GABARITO</b>}
                        {isSelected && !isAnswer && <b>SUA RESPOSTA</b>}
                      </div>;
                    })}
                  </div>
                  <p className="explanation"><strong>Por quê?</strong> {question.explanation}</p>
                </article>
              );
            })}
          </div>
          <div className="review-end"><button className="button button-primary" onClick={startExam}>Fazer novo simulado <span aria-hidden="true">↻</span></button></div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!currentQuestion) return null;
  const selectedAnswer = answers[currentQuestion.id];
  const progress = Math.round((answeredCount / EXAM_SIZE) * 100);
  const lowTime = remainingSeconds <= 5 * 60;

  return (
    <main className="site-shell exam-shell">
      <Header compact />
      <section className="exam-wrap">
        <div className="exam-topline">
          <div><p className="eyebrow"><span className="pulse-dot" /> SIMULADO EM ANDAMENTO</p><h1>Fundamentos de cloud</h1></div>
          <div className={`timer-card ${lowTime ? "timer-low" : ""}`} aria-live="polite"><span className="timer-icon" aria-hidden="true">◷</span><div><span>TEMPO RESTANTE</span><strong>{formatTime(remainingSeconds)}</strong></div></div>
        </div>
        <div className="exam-progress"><div className="progress-label"><span>PROGRESSO</span><strong>{answeredCount} <small>de {EXAM_SIZE} respondidas</small></strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
        <div className="exam-layout">
          <section className="question-card" aria-labelledby="question-title">
            <div className="question-meta"><span className="question-count">QUESTÃO <b>{String(currentIndex + 1).padStart(2, "0")}</b><i> / {EXAM_SIZE}</i></span><span className="category-tag">{currentQuestion.category}</span></div>
            <h2 id="question-title">{currentQuestion.question}</h2>
            <p className="select-hint">Selecione uma alternativa</p>
            <div className="answer-options" role="group" aria-label="Alternativas de resposta">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                return <button key={option} type="button" className={`answer-option ${isSelected ? "option-selected" : ""}`} aria-pressed={isSelected} onClick={() => chooseAnswer(index)}>
                  <span className="option-letter">{LETTERS[index]}</span><span className="option-text">{option}</span><span className="option-check" aria-hidden="true">{isSelected ? "✓" : ""}</span>
                </button>;
              })}
            </div>
            <div className="question-navigation"><button className="button button-secondary" onClick={() => moveTo(currentIndex - 1)} disabled={currentIndex === 0}><span aria-hidden="true">←</span> Anterior</button><span>{currentIndex + 1} <i>/</i> {EXAM_SIZE}</span>{currentIndex < EXAM_SIZE - 1 ? <button className="button button-primary" onClick={() => moveTo(currentIndex + 1)}>Próxima <span aria-hidden="true">→</span></button> : <button className="button button-primary" onClick={() => setScreen("result")}>Finalizar prova <span aria-hidden="true">✓</span></button>}</div>