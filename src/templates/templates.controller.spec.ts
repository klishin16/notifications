import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('TemplatesController', () => {
  let controller: TemplatesController;
  let templatesService: TemplatesService;

  const mockFile = createMock<Express.Multer.File>({
    fieldname: 'file',
    originalname: 'test.txt',
    encoding: 'utf8',
    mimetype: 'text/plain',
    buffer: Buffer.from('Hello, World!'),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [TemplatesService],
    })
      .overrideProvider(FileInterceptor)
      .useValue({
        // Mock FileInterceptor to intercept the upload request
        // and return a controlled mock file
        intercept: (target: any, key: any, descriptor: any) => {
          const method = descriptor.value;
          return (...args: any[]) => {
            return method.apply(target, [mockFile, ...args]);
          };
        },
      })
      .compile();

    controller = module.get<TemplatesController>(TemplatesController);
    templatesService = module.get(TemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload a .hbs file successfully', () => {
    const mockFile = {
      originalname: 'template.hbs',
    } as Express.Multer.File;

    const result = controller.uploadTemplate(mockFile);

    expect(result).toEqual({
      message: 'Template uploaded successfully',
      filename: 'template.hbs',
    });
  });

  it('should throw an error if no file is uploaded', async () => {
    expect(() => controller.uploadTemplate(null)).toThrow(BadRequestException);
  });

  it('should return success message if valid .hbs file is uploaded', async () => {
    const file = { originalname: 'template.hbs' } as Express.Multer.File;
    expect(controller.uploadTemplate(file)).toEqual({
      message: 'Template uploaded successfully',
      filename: 'template.hbs',
    });
  });

  it('should throw BadRequestException if file extension is not .hbs', () => {
    const mockFile = {
      originalname: 'template.txt',
    } as Express.Multer.File;

    const interceptor = new (FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/email/templates',
        filename: (req, file, cb) => {
          if (!file.originalname.endsWith('.hbs')) {
            console.log('here');
            return cb(new BadRequestException('Only .hbs files allowed'), '');
          }
          cb(null, file.originalname);
        },
      }),
    }))();

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          file: mockFile,
        }),
        getResponse: () => ({}),
      }),
    });

    const next = {
      handle: jest.fn(),
    };

    (interceptor.intercept(mockExecutionContext, next) as Promise<any>).catch(
      (error: any) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Only .hbs files allowed');
      },
    );
  });

  it('should return templates', () => {
    jest.spyOn(templatesService, 'getTemplates').mockReturnValue([]);

    expect(controller.getTemplates()).toStrictEqual([]);
  });

  it('should return template', () => {
    jest.spyOn(templatesService, 'getTemplate').mockReturnValue('test');

    expect(controller.getTemplate('test')).toBe('test');
  });

  it('should upload a file', async () => {
    const result = await controller.uploadTemplate(mockFile);
    expect(result).toStrictEqual({
      filename: 'test.txt',
      message: 'Template uploaded successfully',
    });
  });
});
