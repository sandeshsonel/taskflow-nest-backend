import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BugReport, BugReportDocument } from './schemas/bug-report.schema';
import { CreateBugReportDto } from './dto/create-bug-report.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class BugReportService {
  constructor(
    @InjectModel(BugReport.name)
    private readonly bugReportModel: Model<BugReportDocument>,
    private readonly i18n: I18nService,
  ) { }

  async createBugReport(
    createBugReportDto: CreateBugReportDto,
    files: Express.Multer.File[],
    protocol: string,
    host: string,
  ) {
    const processedFiles = !files?.length
      ? []
      : await Promise.all(
        files.map(async (file) => {
          const originalPath = file.path;
          const filename = file.filename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          const compressedPath = path.join(path.dirname(originalPath), filename);

          // Step 1: read file into memory
          const inputBuffer = await fs.readFile(originalPath);

          // Step 2: delete original
          await fs.unlink(originalPath);

          // Step 3: compress and save
          await sharp(inputBuffer)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(compressedPath);

          return `${protocol}://${host}/bug-attachments/${filename}`;
        }),
      );

    await this.bugReportModel.create({
      ...createBugReportDto,
      attachments: processedFiles,
    });

    return {
      success: true,
      message: this.i18n.t('bug-report.SUCCESS.CREATE', {
        lang: I18nContext.current().lang,
      }),
    };
  }
}
