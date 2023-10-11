import { z } from 'zod'

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    // Handle validation errors
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map(error => ({
        message: error.message,
        path: error.path.join('.')
      }))
    })
  }

  // Log the error (consider using a logging library or service here)
  console.error(err)

  // Handle unknown errors
  return res.status(500).json({
    message: 'An unexpected error occurred'
  })
}
