import { CONFIG } from './config';
import { createClient } from '@supabase/supabase-js';

export type Question = {
  id: string;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type Answers = Record<string, number>;

// Inicializa o cliente do Supabase com as credenciais pÃºblicas do config.ts
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/**
 * Busca todas as questÃµes hospedadas na Edge Function do Supabase
 */
export async function fetchQuestionsFromSupabase(): Promise<Question[]> {
  try {
    // Chama a Edge Function 'questions'
    const { data, error } = await supabase.functions.invoke('questions');

    if (error) {
      throw error;
    }

    if (data && data.success && Array.isArray(data.data)) {
      return data.data as Question[];
    }

    throw new Error('A resposta da Edge Function nÃ£o veio no formato esperado.');
  } catch (err) {
    console.error('Erro ao carregar questÃµes do Supabase:', err);
    return [];
  }
}

export function shuffleQuestions<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createExam(bank: Question[], count: number): Question[] {
  if (bank.length < count) {
    throw new Error(`O banco precisa ter pelo menos ${count} questÃµes.`);
  }
  return shuffleQuestions(bank).slice(0, count).map((question) => {
    if (
      !Number.isInteger(question.answerIndex) ||
      question.answerIndex < 0 ||
      question.answerIndex >= question.options.length
    ) {
      throw new Error(`A questÃ£o ${question.id} tem um Ã­ndice de gabarito invÃ¡lido.`);
    }

    const shuffledOptions = shuffleQuestions(
      question.options.map((text, originalIndex) => ({ text, originalIndex })),
    );

    return {
      ...question,
      options: shuffledOptions.map((option) => option.text),
      answerIndex: shuffledOptions.findIndex(
        (option) => option.originalIndex === question.answerIndex,
      ),
    };
  });
}

export function calculateScore(questions: Question[], answers: Answers) {
  const correct = questions.reduce(
    (total, question) => total + (answers[question.id] === question.answerIndex ? 1 : 0),
    0,
  );
  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, percentage, passed: percentage >= 75 };
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}