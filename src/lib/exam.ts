export type Question = {
  id: string;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type Answers = Record<string, number>;

export function shuffleQuestions<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createExam<T>(bank: T[], count: number): T[] {
  if (bank.length < count) {
    throw new Error(`O banco precisa ter pelo menos ${count} questões.`);
  }
  return shuffleQuestions(bank).slice(0, count);
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
