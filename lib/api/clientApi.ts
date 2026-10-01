import { isAxiosError } from 'axios'

import { http } from './http'

export type RegisterRequest = {
  username: string
  email: string
  password: string
}

type ApiErrorResponse = {
  error?: string
  response?: {
    error?: string
    message?: string
  }
}

function getRequestError(error: unknown): Error {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined

    if (data?.response?.message === 'Email in use') {
      return new Error('Користувач із такою поштою вже існує.')
    }

    return new Error(
      data?.response?.message ??
        data?.response?.error ??
        data?.error ??
        error.message,
    )
  }

  return error instanceof Error
    ? error
    : new Error('Не вдалося зареєструватися. Спробуйте ще раз.')
}

export async function register(data: RegisterRequest): Promise<void> {
  try {
    await http.post('/api/auth/register', data)
  } catch (error) {
    throw getRequestError(error)
  }
}
