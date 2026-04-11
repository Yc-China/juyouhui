import { Request, Response, NextFunction } from 'express'
import { error } from '../utils'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json(error(err.message, 400))
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(error('无效的令牌', 401))
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(error('令牌已过期', 401))
  }

  res.status(err.statusCode || 500).json(error(err.message || '服务器内部错误', err.statusCode || 500))
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json(error('接口不存在', 404))
}
