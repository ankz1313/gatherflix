import { track } from '@vercel/analytics'

export function trackSignup() {
  track('Signup')
}

export function trackLogin() {
  track('Login')
}

export function trackTriviaStarted(quizId: string, quizTitle: string) {
  track('TriviaStarted', { quizId, quizTitle })
}

export function trackPlayerJoined() {
  track('PlayerJoined')
}
