interface ApiErrorResponse {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseApiErrorResponse(value: unknown): ApiErrorResponse {
  if (!isRecord(value) || !isRecord(value.error)) {
    return {}
  }

  return {
    error: {
      code:
        typeof value.error.code === 'string'
          ? value.error.code
          : undefined,
      message:
        typeof value.error.message === 'string'
          ? value.error.message
          : undefined,
      details: value.error.details,
    },
  }
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()

  if (!text) {
    return undefined
  }

  return JSON.parse(text)
}

export async function apiRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')

  if (init.body !== undefined && init.body !== null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers,
    })

    const responseData = await parseJsonResponse(response)

    if (!response.ok) {
      const errorResponse = parseApiErrorResponse(responseData)
      const code = errorResponse.error?.code ?? 'API_ERROR'
      const message =
        errorResponse.error?.message ||
        response.statusText ||
        'The API request failed.'

      throw new ApiError(
        response.status,
        code,
        message,
        errorResponse.error?.details,
      )
    }

    return responseData as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Unable to connect to the API.',
      error,
    )
  }
}
