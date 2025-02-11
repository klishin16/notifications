import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/email/templates',
        filename: (req, file, cb) => {
          /* istanbul ignore next */
          if (!file.originalname.endsWith('.hbs')) {
            return cb(new BadRequestException('Only .hbs files allowed'), '');
          }
          /* istanbul ignore next */
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadTemplate(@UploadedFile() file: Express.Multer.File | null) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return {
      message: 'Template uploaded successfully',
      filename: file.originalname,
    };
  }

  @Get()
  getTemplates() {
    return this.templatesService.getTemplates();
  }

  @Get(':name')
  getTemplate(@Param('name') name: string) {
    return this.templatesService.getTemplate(name);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.templatesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTemplateDto: UpdateTemplateDto,
  // ) {
  //   return this.templatesService.update(+id, updateTemplateDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.templatesService.remove(+id);
  // }
}
