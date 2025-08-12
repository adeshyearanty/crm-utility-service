import { ApiProperty } from '@nestjs/swagger';

import { ActivityType } from '../model/activity.model';

export class LogTaskActivityDto {
  @ApiProperty({ required: false })
  leadId?: string;

  @ApiProperty({ required: false })
  dealId?: string;

  @ApiProperty({ required: false })
  contactId?: string;

  @ApiProperty({ required: false })
  eventId?: string;

  @ApiProperty({ required: false })
  noteId?: string;

  @ApiProperty({ required: false })
  mailId?: string;

  @ApiProperty({ required: false })
  taskId?: string;

  @ApiProperty({ required: false, enum: ActivityType })
  activityType?: ActivityType;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  performedBy?: string;

  @ApiProperty({ required: false, type: Object })
  metadata?: Record<string, any>;
}
