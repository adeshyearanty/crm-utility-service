import { Injectable, Logger } from '@nestjs/common';

import { LogTaskActivityDto } from '../dto/log-task-activity.dto';
import { PaginatedResponse } from '../dto/pagination.dto';
import { ActivityType } from '../model/activity.model';
import { ActivityRepository } from '../repository/activity.repository';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);
  constructor(private readonly activityRepository: ActivityRepository) {}

  async logActivity(body: LogTaskActivityDto) {
    const {
      leadId,
      dealId,
      contactId,
      eventId,
      noteId,
      mailId,
      taskId,
      activityType,
      description,
      performedBy,
      metadata,
    } = body;

    const allIds = {
      leadId,
      dealId,
      contactId,
      eventId,
      noteId,
      mailId,
      taskId,
    };
    const filteredIds = Object.fromEntries(
      Object.entries(allIds).filter(([, value]) => !!value),
    );

    return this.activityRepository.create(
      filteredIds as Record<string, string>,
      activityType,
      description,
      performedBy,
      metadata,
    );
  }

  async getTimeline(
    page = 1,
    limit = 10,
    activityType?: ActivityType,
    filterIds: Record<string, string> = {},
  ): Promise<PaginatedResponse<any>> {
    const { activities, total } = await this.activityRepository.findByIds(
      filterIds,
      page,
      limit,
      activityType,
    );

    return {
      data: activities,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }
}
