export const ErrorMessage = {
  User: {
    Logout: 'You must be log in',
    IdMatching: 'You are not allowed to modify this lesson',
  },
  File: {
    RelatedLesson: 'Failed to find related lesson',
    Ownership: 'You do not own any of the provided files',
    NotFound: 'File not found',
    NoFile: 'No files provided',
    FailedVerif: 'Failed to verify file ownership',
  },
} as const
