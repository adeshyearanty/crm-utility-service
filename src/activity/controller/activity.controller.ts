import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LogTaskActivityDto } from '../dto/log-task-activity.dto';
import { ActivityType } from '../model/activity.model';
import { ActivityService } from '../service/activity.service';

@ApiTags('Activity')
@Controller({
  path: 'activity',
  version: '1',
})
export class ActivityController {
  private readonly logger = new Logger(ActivityController.name);

  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'activityType', required: false, enum: ActivityType })
  @ApiQuery({ name: 'leadId', required: false, type: String })
  @ApiQuery({ name: 'dealId', required: false, type: String })
  @ApiQuery({ name: 'contactId', required: false, type: String })
  @ApiQuery({ name: 'eventId', required: false, type: String })
  @ApiQuery({ name: 'noteId', required: false, type: String })
  @ApiQuery({ name: 'mailId', required: false, type: String })
  async getActivityTimeline(
    @Query() query: Record<string, string>,
    @Query('activityType') activityType?: ActivityType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Extract only actual filter fields
    const { leadId, dealId, contactId, eventId, noteId, mailId } = query;
    const filterIds = { leadId, dealId, contactId, eventId, noteId, mailId };

    // Convert string parameters to numbers
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 5;

    // Extract activityType from query if not provided as separate parameter
    const finalActivityType =
      activityType || (query.activityType as ActivityType);

    return this.activityService.getTimeline(
      pageNumber,
      limitNumber,
      finalActivityType,
      filterIds,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Log a generic activity' })
  @ApiResponse({ status: 201, description: 'Activity logged successfully' })
  @ApiBody({ type: LogTaskActivityDto })
  async logActivity(@Body() body: LogTaskActivityDto) {
    return this.activityService.logActivity(body);
  }
}
