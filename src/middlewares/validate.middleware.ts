import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import { RegisterDto } from '../dtos/register.dto';

export function validateDto(dtoClass: typeof RegisterDto): RequestHandler {
  return async (req, res, next) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }
    req.body = dto;
    next();
  };
} 