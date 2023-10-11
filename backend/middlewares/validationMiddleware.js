export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      // Pass the error to the error middleware
      next(error)
    }
  }
}
