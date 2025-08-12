import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivityController } from './controller/activity.controller';
import { Activity, ActivitySchema } from './model/activity.model';
import { ActivityRepository } from './repository/activity.repository';
import { ActivityService } from './service/activity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository],
})
export class ActivityModule {}
