import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BugReportController } from './bug-report.controller';
import { BugReportService } from './bug-report.service';
import { BugReport, BugReportSchema } from './schemas/bug-report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BugReport.name, schema: BugReportSchema },
    ]),
  ],
  controllers: [BugReportController],
  providers: [BugReportService],
})
export class BugReportModule {}
