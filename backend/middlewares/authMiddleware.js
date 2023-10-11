import pkg from 'jsonwebtoken'
const { verify } = pkg
const secret = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    return res.status(401).json({ message: 'Authentication token required' })
  }
}

export default authMiddleware
