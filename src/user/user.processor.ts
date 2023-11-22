import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Processor('user-queue')
export class UserProcessor {
  private readonly logger = new Logger(UserProcessor.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  @OnQueueFailed()
  handler(job: Job, error: Error) {
    this.logger.error('end job' + String(job.id));
  }
  @Process('status_after_save_user')
  async afterCreateNewConclusionGeneratePdfAndSave(
    job: Job<{ user_id: number }>,
  ) {
    await this.userRepository.update(
      { id: Number(job.data.user_id) },
      { status: true },
    );
  }
}
