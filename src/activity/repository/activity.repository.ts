import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityType } from '../model/activity.model';

@Injectable()
export class ActivityRepository {
  private readonly logger = new Logger(ActivityRepository.name);

  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<Activity>,
  ) {}

  async create(
    relatedIds: Record<string, string>,
    activityType?: ActivityType,
    description?: string,
    performedBy?: string,
    metadata?: Record<string, any>,
  ): Promise<Activity> {
    try {
      const activity = new this.activityModel({
        ...relatedIds,
        activityType,
        description,
        performedBy,
        metadata,
      });
      return activity.save();
    } catch (error) {
      this.logger.error('Error creating activity:', error);
      throw new InternalServerErrorException('Failed to create activity');
    }
  }

  async findByIds(
    ids: Record<string, string>,
    page: number,
    limit: number,
    activityType?: ActivityType,
  ): Promise<{ activities: Activity[]; total: number }> {
    try {
      const query: Record<string, string> = {};

      Object.entries(ids || {}).forEach(([key, value]) => {
        if (value) query[key] = value;
      });

      if (activityType) query.activityType = activityType;

      const [activities, total] = await Promise.all([
        this.activityModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .exec(),
        this.activityModel.countDocuments(query).exec(),
      ]);

      return { activities, total };
    } catch (error) {
      this.logger.error('Error fetching activities:', error);
      throw new InternalServerErrorException('Failed to fetch activities');
    }
  }
}
