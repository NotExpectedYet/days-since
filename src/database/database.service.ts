import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  clean() {
    return this.$transaction([
      this.category.deleteMany(),
      this.counter.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
