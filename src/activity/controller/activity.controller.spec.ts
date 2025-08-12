import { Test, TestingModule } from '@nestjs/testing';
import { LogTaskActivityDto } from '../dto/log-task-activity.dto';
import { ActivityType } from '../model/activity.model';
import { ActivityService } from '../service/activity.service';
import { ActivityController } from './activity.controller';

describe('ActivityController', () => {
  let controller: ActivityController;

  const mockActivityService = {
    logActivity: jest.fn(),
    getTimeline: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should call logActivity on service with correct body', async () => {
    const dto: LogTaskActivityDto = {
      leadId: 'lead123',
      activityType: ActivityType.NOTE_COMMENT_ADDED,
      description: 'Test comment',
      performedBy: 'user123',
    };

    mockActivityService.logActivity.mockResolvedValue({ success: true });

    const logResult = await controller.logActivity(dto);
    expect(mockActivityService.logActivity).toHaveBeenCalledWith(dto);
    expect(logResult).toEqual({ success: true });
    const query = {
      leadId: 'lead123',
      activityType: ActivityType.TASK_CREATED,
      page: 1,
      limit: 5,
    };

    const expectedResponse = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        lastPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    mockActivityService.getTimeline.mockResolvedValue(expectedResponse);

    const result = await controller.getActivityTimeline({
      leadId: query.leadId,
      activityType: query.activityType,
      page: String(query.page),
      limit: String(query.limit),
    });

    expect(mockActivityService.getTimeline).toHaveBeenCalledWith(
      1,
      5,
      query.activityType,
      {
        leadId: 'lead123',
        dealId: undefined,
        contactId: undefined,
        eventId: undefined,
        noteId: undefined,
        mailId: undefined,
      },
    );

    expect(result).toEqual(expectedResponse);
  });
});
