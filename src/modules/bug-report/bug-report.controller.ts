import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { Public } from '@modules/auth';
import { BugReportService } from './bug-report.service';
import { CreateBugReportDto } from './dto/create-bug-report.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Bug Report')
@ApiExtraModels(CreateBugReportDto)
@Public()
@Controller('bug-report')
export class BugReportController {
  constructor(private readonly bugReportService: BugReportService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads/bug-attachments',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException('ERR_INVALID_FILE_TYPE'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1 * 1024 * 1024, // 1MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Submit a bug report',
    description: 'Submits a bug report with optional file attachments (up to 5 images). All uploaded images are automatically optimized and converted to WebP.',
  })
  @ApiResponse({ status: 201, description: 'Bug report submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input or file type.' })
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateBugReportDto) },
        {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      ],
    },
  })
  async createBugReport(
    @Body() createBugReportDto: CreateBugReportDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return this.bugReportService.createBugReport(
      createBugReportDto,
      files,
      req.protocol,
      req.get('host'),
    );
  }
}
