import { ExecutionContext } from '@nestjs/common';
import { Pagination } from './pagination.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

// eslint-disable-next-line @typescript-eslint/ban-types
function getParamDecoratorFactory(decorator: Function) {
  class Test {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    public test(@decorator() value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('Pagination decorator', () => {
  it('should return the pagination object from the request', () => {
    // Создаем мок ExecutionContext
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          query: {},
        }),
      }),
    };

    const factory = getParamDecoratorFactory(Pagination);
    const result = factory(null, mockExecutionContext);

    expect(result).toEqual({ limit: 10, search: [], skip: 0, sort: [] });
  });

  it('should return the pagination object from the request with skip and limit', () => {
    // Создаем мок ExecutionContext
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          query: {
            skip: 5,
            limit: 5,
          },
        }),
      }),
    };

    const factory = getParamDecoratorFactory(Pagination);
    const result = factory(null, mockExecutionContext);

    expect(result).toEqual({ limit: 5, search: [], skip: 5, sort: [] });
  });
});
