import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPagination } from '../types/pagination.interface';
import { Request } from 'express';

export const Pagination = createParamDecorator((data, context: ExecutionContext) => {
  const req: Request = context.switchToHttp().getRequest();

  const paginationParams: IPagination = {
    skip: 0,
    limit: 10,
    sort: [],
    search: []
  }

  paginationParams.skip = req.query.skip ? parseInt(String(req.query.skip)) : 0;
  paginationParams.limit = req.query.limit ? parseInt(String(req.query.limit)) : 10;


  return paginationParams;
})