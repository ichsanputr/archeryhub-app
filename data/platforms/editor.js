// Centralized mapping of platform to Monaco editor language, file extension, and Judge0 language id

export function getEditorConfigForPlatform(platform) {
  const key = (platform || 'rust').toLowerCase()
  switch (key) {
    case 'python':
      return { language: 'python', ext: 'py', judge0Id: 71 }
    case 'java':
      return { language: 'java', ext: 'java', judge0Id: 62 }
    case 'php':
      return { language: 'php', ext: 'php', judge0Id: 68 }
    case 'javascript':
      return { language: 'javascript', ext: 'js', judge0Id: 63 }
    case 'typescript':
      return { language: 'typescript', ext: 'ts', judge0Id: 74 }
    default:
      return { language: 'rust', ext: 'rs', judge0Id: 73 }
  }
}


