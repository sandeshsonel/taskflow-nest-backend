import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, fallback?: string) => {
              const map: Record<string, string> = {
                'app.environment': 'test',
              };
              return map[key] ?? fallback;
            },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /', () => {
    it('should return API metadata with expected fields', () => {
      const result = appController.getRoot();

      expect(result).toHaveProperty('name', 'TaskFlow Nest API');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('environment', 'test');
      expect(result).toHaveProperty('docs', '/api/docs');
      expect(result).toHaveProperty('timestamp');
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
});
