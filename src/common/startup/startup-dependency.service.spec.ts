const mockRedisConnect = jest.fn();
const mockRedisPing = jest.fn();
const mockRedisDisconnect = jest.fn();

jest.mock('ioredis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    connect: mockRedisConnect,
    ping: mockRedisPing,
    disconnect: mockRedisDisconnect,
  })),
}));

import Redis from 'ioredis';

import { StartupDependencyService } from './startup-dependency.service';

describe('StartupDependencyService', () => {
  let service: StartupDependencyService;
  let mongoPing: jest.Mock;
  let connection: {
    readyState: number;
    name: string;
    db: { admin: () => { ping: jest.Mock } };
  };
  let configService: { get: jest.Mock };

  beforeEach(() => {
    mongoPing = jest.fn().mockResolvedValue({ ok: 1 });
    connection = {
      readyState: 1,
      name: 'taskflow',
      db: {
        admin: () => ({
          ping: mongoPing,
        }),
      },
    };
    configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, unknown> = {
          'throttler.redis.enabled': false,
          'throttler.redis.host': 'localhost',
          'throttler.redis.port': 6379,
        };

        return values[key];
      }),
    };

    mockRedisConnect.mockResolvedValue(undefined);
    mockRedisPing.mockResolvedValue('PONG');
    mockRedisDisconnect.mockReturnValue(undefined);
    (Redis as unknown as jest.Mock).mockClear();

    service = new StartupDependencyService(
      connection as any,
      configService as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('checks MongoDB and skips Redis when throttler Redis is disabled', async () => {
    await expect(service.onApplicationBootstrap()).resolves.toBeUndefined();

    expect(mongoPing).toHaveBeenCalledTimes(1);
    expect(Redis).not.toHaveBeenCalled();
  });

  it('fails startup when MongoDB is not ready', async () => {
    connection.readyState = 0;

    await expect(service.onApplicationBootstrap()).rejects.toThrow(
      'MongoDB connection is not ready',
    );
  });

  it('checks Redis when throttler Redis is enabled', async () => {
    configService.get.mockImplementation((key: string) => {
      const values: Record<string, unknown> = {
        'throttler.redis.enabled': true,
        'throttler.redis.host': 'redis.internal',
        'throttler.redis.port': 6380,
      };

      return values[key];
    });

    await expect(service.onApplicationBootstrap()).resolves.toBeUndefined();

    expect(Redis).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'redis.internal',
        port: 6380,
        lazyConnect: true,
      }),
    );
    expect(mockRedisConnect).toHaveBeenCalledTimes(1);
    expect(mockRedisPing).toHaveBeenCalledTimes(1);
    expect(mockRedisDisconnect).toHaveBeenCalledTimes(1);
  });
});
