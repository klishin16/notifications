import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import * as fs from 'node:fs';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplatesService],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return templates', () => {
    jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
    expect(service.getTemplates()).toStrictEqual([]);
  });

  it('should return template', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('test');

    expect(service.getTemplate('test')).toBe('test');
  });

  it('should throw error', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect(() => service.getTemplate('test')).toThrow('Template not found');
  });
});
