export const ErrorMessage = {
  User: {
    Logout: 'You must be log in',
    IdMatching: 'You are not allowed to modify this lesson',
    Fetch: 'Unable to fetch user info for the given userId',
  },
  File: {
    RelatedLesson: 'Failed to find related lesson',
    Ownership: 'You do not own any of the provided files',
    OwnershipError: 'Failed to verify ownership',
    NotFound: 'File not found',
    NoFile: 'No files provided',
    FailedVerif: 'Failed to verify file ownership',
  },
  Lessons: {
    NotFound: 'Lesson not found',
    NotFoundAuthor: 'No lessons found for the given author',
    NotAllowed: 'You are not allowed to modify this lesson',
    NoTitle: 'A title is required',
    NoTags: 'At least one tag is required',
    Collision: 'A lesson with the same title already exists for this author',
    Ok: 'Operation successful',
  },
} as const
