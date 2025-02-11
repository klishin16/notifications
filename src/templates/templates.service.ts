import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

const TEMPLATE_DIR = path.join(__dirname, '..', 'email', 'templates');

@Injectable()
export class TemplatesService {
  public getTemplates() {
    return fs.readdirSync(TEMPLATE_DIR).map((file) => file.replace('.hbs', ''));
  }

  public getTemplate(name: string) {
    const filePath = path.join(
      TEMPLATE_DIR,
      `${name.replace('.hbs', '') + '.hbs'}`,
    );

    if (!fs.existsSync(filePath)) {
      throw new Error('Template not found');
    }

    return fs.readFileSync(filePath, 'utf-8');
  }
}
