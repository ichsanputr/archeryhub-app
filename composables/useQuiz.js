// Composable for quiz data and operations
import { 
  categories, 
  quizzes, 
  getAllCategories, 
  getCategoryBySlug, 
  getQuizBySlug, 
  getQuizzesByCategory,
  checkAnswer,
  calculateQuizResult
} from '~/data/quizzes'

export function useQuiz() {
  const api = useApi()
  const auth = useAuth()

  // Get all categories with quiz count
  const getCategories = () => {
    return getAllCategories()
  }

  // Get category by slug
  const getCategory = (slug) => {
    return getCategoryBySlug(slug)
  }

  // Get all quizzes for a category
  const getCategoryQuizzes = (categorySlug) => {
    return getQuizzesByCategory(categorySlug)
  }

  // Get single quiz by slug
  const getQuiz = (slug) => {
    return getQuizBySlug(slug)
  }

  // Check if a single answer is correct (client-side)
  const validateAnswer = (quizSlug, questionId, selectedAnswer) => {
    return checkAnswer(quizSlug, questionId, selectedAnswer)
  }

  // Calculate quiz results (client-side)
  const calculateResults = (quizSlug, answers) => {
    return calculateQuizResult(quizSlug, answers)
  }

  // Submit quiz results to API (requires authentication)
  const submitQuiz = async (categorySlug, quizSlug, answers, timeSpent) => {
    const result = calculateQuizResult(quizSlug, answers)
    if (!result) throw new Error('Quiz not found')

    const response = await api.post(`/user/quiz/${categorySlug}/${quizSlug}/submit`, {
      score: result.score,
      total_questions: result.totalQuestions,
      correct_answers: result.correctAnswers,
      time_spent: timeSpent
    })

    return {
      ...result,
      submitted: response.success
    }
  }

  // Save/bookmark a quiz (requires authentication)
  const saveQuiz = async (categorySlug, quizSlug) => {
    return await api.post(`/user/quiz/${categorySlug}/${quizSlug}/save`)
  }

  // Unsave a quiz (requires authentication)
  const unsaveQuiz = async (categorySlug, quizSlug) => {
    return await api.delete(`/user/quiz/${categorySlug}/${quizSlug}/save`)
  }

  // Check if quiz is saved (requires authentication)
  const isQuizSaved = async (quizSlug) => {
    if (!auth.isLoggedIn.value) return false
    
    const response = await api.get(`/user/quiz/${quizSlug}/saved`)
    return response.saved
  }

  // Check if quiz is completed (requires authentication)
  const isQuizCompleted = async (quizSlug) => {
    if (!auth.isLoggedIn.value) return false
    
    const response = await api.get(`/user/quiz/${quizSlug}/completed`)
    return response.completed
  }

  // Get user's saved quizzes (requires authentication)
  const getSavedQuizzes = async () => {
    const response = await api.get('/user/quiz/saved')
    
    // Enrich with quiz data from static files
    return response.data.map(saved => {
      const quiz = getQuizBySlug(saved.quiz_slug)
      return {
        ...saved,
        ...quiz
      }
    })
  }

  // Get user's quiz attempts (requires authentication)
  const getUserAttempts = async () => {
    const response = await api.get('/user/quiz/attempts')
    
    // Enrich with quiz data from static files
    return response.data.map(attempt => {
      const quiz = getQuizBySlug(attempt.quiz_slug)
      return {
        ...attempt,
        quizTitle: quiz?.title,
        quizDescription: quiz?.description
      }
    })
  }

  // Get user progress statistics (requires authentication)
  const getUserProgress = async () => {
    return await api.get('/user/quiz/progress')
  }

  return {
    // Data
    categories,
    quizzes,
    
    // Getters
    getCategories,
    getCategory,
    getCategoryQuizzes,
    getQuiz,
    
    // Client-side operations
    validateAnswer,
    calculateResults,
    
    // API operations (authenticated)
    submitQuiz,
    saveQuiz,
    unsaveQuiz,
    isQuizSaved,
    isQuizCompleted,
    getSavedQuizzes,
    getUserAttempts,
    getUserProgress
  }
}
