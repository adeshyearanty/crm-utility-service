import { Test, TestingModule } from '@nestjs/testing';

import { LogTaskActivityDto } from '../dto/log-task-activity.dto';
import { ActivityType } from '../model/activity.model';
import { ActivityRepository } from '../repository/activity.repository';
import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  let service: ActivityService;

  const mockRepo = {
    create: jest.fn(),
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: ActivityRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('logActivity', () => {
    it('should call create with filtered IDs', async () => {
      const body = {
        leadId: 'lead1',
        activityType: ActivityType.NOTE_COMMENT_ADDED,
        description: 'Called lead',
        performedBy: 'user1',
        metadata: { duration: '5min' },
      };

      mockRepo.create.mockResolvedValue({ id: 'mock-id', ...body });

      const result = await service.logActivity(body as LogTaskActivityDto);

      expect(mockRepo.create).toHaveBeenCalledWith(
        { leadId: 'lead1' },
        ActivityType.NOTE_COMMENT_ADDED,
        'Called lead',
        'user1',
        { duration: '5min' },
      );

      expect(result).toEqual(expect.objectContaining({ id: 'mock-id' }));
    });
  });

  describe('getTimeline', () => {
    it('should return formatted paginated response', async () => {
      mockRepo.findByIds.mockResolvedValue({
        activities: ['a1', 'a2'],
        total: 2,
      });

      const result = await service.getTimeline(
        1,
        1,
        ActivityType.NOTE_COMMENT_ADDED,
        {
          leadId: 'lead123',
        },
      );

      expect(result).toEqual({
        data: ['a1', 'a2'],
        meta: {
          total: 2,
          page: 1,
          lastPage: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });
  });
});
