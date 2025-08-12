import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ActivityType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_UPDATED = 'LEAD_UPDATED',
  LEAD_DELETED = 'LEAD_DELETED',
  DEAL_CREATED = 'DEAL_CREATED',
  DEAL_UPDATED = 'DEAL_UPDATED',
  DEAL_DELETED = 'DEAL_DELETED',
  CONTACT_CREATED = 'CONTACT_CREATED',
  CONTACT_UPDATED = 'CONTACT_UPDATED',
  CONTACT_DELETED = 'CONTACT_DELETED',
  CALENDAR_EVENT_CREATED = 'CALENDAR_EVENT_CREATED',
  CALENDAR_EVENT_UPDATED = 'CALENDAR_EVENT_UPDATED',
  CALENDAR_EVENT_DELETED = 'CALENDAR_EVENT_DELETED',
  NOTE_CREATED = 'NOTE_CREATED',
  NOTE_UPDATED = 'NOTE_UPDATED',
  NOTE_DELETED = 'NOTE_DELETED',
  NOTE_PINNED = 'NOTE_PINNED',
  NOTE_UNPINNED = 'NOTE_UNPINNED',
  NOTE_TASK_CREATED = 'NOTE_TASK_CREATED',
  NOTE_TASK_UPDATED = 'NOTE_TASK_UPDATED',
  NOTE_TASK_DELETED = 'NOTE_TASK_DELETED',
  NOTE_COMMENT_ADDED = 'NOTE_COMMENT_ADDED',
  NOTE_COMMENT_UPDATED = 'NOTE_COMMENT_UPDATED',
  NOTE_COMMENT_DELETED = 'NOTE_COMMENT_DELETED',
  MAIL_CREATED = 'MAIL_CREATED',
  MAIL_UPDATED = 'MAIL_UPDATED',
  MAIL_DELETED = 'MAIL_DELETED',
}

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop() leadId?: string;
  @Prop() dealId?: string;
  @Prop() contactId?: string;
  @Prop() eventId?: string;
  @Prop() noteId?: string;
  @Prop() mailId?: string;
  @Prop() taskId?: string;

  @Prop({ type: String, enum: ActivityType })
  activityType?: ActivityType;

  @Prop() description?: string;

  @Prop() performedBy?: string;

  @Prop({ type: Object }) metadata?: Record<string, any>;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
