/**
 * Qualification API Helper Functions
 * 
 * These helpers abstract the new qualification schema API calls
 * Use these instead of direct participant queries for target assignment info
 */

/**
 * Fetch all target assignments for a qualification session
 * @param {string} sessionId - UUID of the qualification session
 * @returns {Promise<Array>} Array of assignments with joined archer and target data
 */
export async function fetchSessionAssignments(sessionId) {
  const { get } = useApi()
  try {
    const response = await get(`/qualification/sessions/${sessionId}/assignments`)
    return response?.assignments || []
  } catch (error) {
    console.error('Failed to fetch session assignments:', error)
    return []
  }
}

/**
 * Fetch qualification sessions for a category
 * @param {string} categoryId - UUID of the event category
 * @returns {Promise<Array>} Array of qualification sessions
 */
export async function fetchQualificationSessions(categoryId) {
  const { get } = useApi()
  try {
    const response = await get(`/categories/${categoryId}/qualification/sessions`)
    return response?.sessions || []
  } catch (error) {
    console.error('Failed to fetch qualification sessions:', error)
    return []
  }
}

/**
 * Create a new qualification session
 * @param {string} categoryId - UUID of the event category
 * @param {Object} sessionData - { name, start_time, end_time, total_ends, arrows_per_end }
 * @returns {Promise<Object>} Created session response
 */
export async function createQualificationSession(categoryId, sessionData) {
  const { post } = useApi()
  return await post(`/categories/${categoryId}/qualification/sessions`, sessionData)
}

/**
 * Auto-assign participants to targets
 * @param {string} sessionId - UUID of the qualification session
 * @param {Object} params - { start_target, archers_per_target }
 * @returns {Promise<Object>} Assignment result
 */
export async function autoAssignTargets(sessionId, params) {
  const { post } = useApi()
  return await post(`/qualification/sessions/${sessionId}/auto-assign`, params)
}

/**
 * Fetch event targets (physical targets master data)
 * @param {string} eventId - UUID of the event
 * @returns {Promise<Array>} Array of event targets
 */
export async function fetchEventTargets(eventId) {
  const { get } = useApi()
  try {
    const response = await get(`/events/${eventId}/targets`)
    return response?.targets || []
  } catch (error) {
    console.error('Failed to fetch event targets:', error)
    return []
  }
}

/**
 * Create a new event target
 * @param {string} eventId - UUID of the event
 * @param {Object} targetData - { target_number, target_name, description, venue_area, capacity, status }
 * @returns {Promise<Object>} Created target response
 */
export async function createEventTarget(eventId, targetData) {
  const { post } = useApi()
  return await post(`/events/${eventId}/targets`, targetData)
}

/**
 * Fetch scores for a specific assignment
 * @param {string} assignmentId - UUID of the target assignment
 * @returns {Promise<Array>} Array of end scores with arrow details
 */
export async function fetchAssignmentScores(assignmentId) {
  const { get } = useApi()
  try {
    const response = await get(`/qualification/assignments/${assignmentId}/scores`)
    return response?.scores || []
  } catch (error) {
    console.error('Failed to fetch assignment scores:', error)
    return []
  }
}

/**
 * Update score for a specific end
 * @param {string} assignmentId - UUID of the target assignment
 * @param {Object} scoreData - { end_number, arrows: ['X', '10', '9', ...] }
 * @returns {Promise<Object>} Update result
 */
export async function updateEndScore(assignmentId, scoreData) {
  const { post } = useApi()
  return await post(`/qualification/assignments/${assignmentId}/scores`, scoreData)
}

/**
 * Fetch leaderboard for a qualification session
 * @param {string} sessionId - UUID of the qualification session
 * @returns {Promise<Array>} Sorted leaderboard data
 */
export async function fetchQualificationLeaderboard(sessionId) {
  const { get } = useApi()
  try {
    const response = await get(`/qualification/sessions/${sessionId}/leaderboard`)
    return response?.leaderboard || []
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return []
  }
}

/**
 * Delete a target assignment
 * @param {string} assignmentId - UUID of the assignment to delete
 * @returns {Promise<Object>} Delete result
 */
export async function deleteTargetAssignment(assignmentId) {
  const { del } = useApi()
  return await del(`/qualification/assignments/${assignmentId}`)
}

/**
 * Helper: Group assignments by target
 * @param {Array} assignments - Array of target assignments
 * @returns {Object} Grouped assignments { target_name: [assignments] }
 */
export function groupAssignmentsByTarget(assignments) {
  const grouped = {}
  assignments.forEach(assignment => {
    const targetKey = assignment.target_name || `Target ${assignment.target_number}` || 'Unknown'
    if (!grouped[targetKey]) {
      grouped[targetKey] = []
    }
    grouped[targetKey].push(assignment)
  })
  return grouped
}

/**
 * Helper: Convert legacy score format to new format
 * Used when transitioning old UI to new API
 * @param {Object} oldScore - { arrow_1, arrow_2, ..., arrow_6 }
 * @returns {Array} arrows - ['X', '10', '9', 'M', '8', '7']
 */
export function convertLegacyScoreToArrows(oldScore) {
  const arrows = []
  for (let i = 1; i <= 6; i++) {
    const arrowValue = oldScore[`arrow_${i}`] || ''
    if (arrowValue) {
      arrows.push(arrowValue.toString().to())
    }
  }
  return arrows
}

/**
 * Helper: Convert new arrow array to legacy format
 * Used for backward compatibility in UI
 * @param {Array} arrows - Arrow scores from new API
 * @returns {Object} Legacy format { arrow_1, arrow_2, ... }
 */
export function convertArrowsToLegacyScore(arrows) {
  const legacy = {}
  arrows.forEach((arrow, idx) => {
    legacy[`arrow_${idx + 1}`] = arrow.is_x ? 'X' : arrow.score.toString()
  })
  return legacy
}

/**
 * Helper: Build participant display with target info
 * Joins participant data with their target assignment
 * @param {Array} participants - Array of participant objects
 * @param {Array} assignments - Array of target assignments
 * @returns {Array} Enhanced participants with target info
 */
export function enhanceParticipantsWithTargets(participants, assignments) {
  return participants.map(participant => {
    const assignment = assignments.find(a => a.archer_uuid === participant.archer_id || a.archer_uuid === participant.uuid)
    return {
      ...participant,
      target_info: assignment ? {
        target_number: assignment.target_number,
        target_name: assignment.target_name,
        target_position: assignment.target_position,
        assignment_uuid: assignment.uuid
      } : null
    }
  })
}

/**
 * Helper: Calculate total score from end scores
 * @param {Array} endScores - Array of end score objects
 * @returns {Object} { totalScore, totalX, total10, endsCompleted }
 */
export function calculateTotalFromEnds(endScores) {
  return endScores.reduce((acc, end) => {
    return {
      totalScore: acc.totalScore + (end.total_score_end || 0),
      totalX: acc.totalX + (end.x_count_end || 0),
      total10: acc.total10 + (end.ten_count_end || 0),
      endsCompleted: acc.endsCompleted + (end.is_confirmed ? 1 : 0)
    }
  }, { totalScore: 0, totalX: 0, total10: 0, endsCompleted: 0 })
}
