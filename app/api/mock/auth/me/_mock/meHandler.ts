const MOCK_USER = {
  id: 'mock-user-1',
  username: 'UserName',
  email: 'user@example.com',
  avatarUrl: null,
}

export const getMeHandler = async (request: Request) => {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer mock-token')) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return Response.json(MOCK_USER)
}
