import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('user-queue') private userQueue: Queue,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user_data = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user_data) {
      throw new BadRequestException('ERR_USER_EMAIL_EXISTS');
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      name: createUserDto.name,
      // TODO encrypt password
      // меня тут не простили это и я не предлагал
      password: createUserDto.password,
    });

    await this.userQueue.add(
      'status_after_save_user',
      { user_id: user.id },
      { delay: 10000 },
    );

    delete user.password;
    return user;
  }

  async findOne(id: number) {
    const cache_user = await this.cacheManager.get(`UserService.findOne ${id}`);
    if (cache_user) {
      return cache_user;
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('ERR_USER_NOT_FOUND');
    }
    // https://stackoverflow.com/questions/74573177/in-nestjs-i-added-redis-as-cache-manager-when-i-specify-ttl-0-it-throws-a
    //TODO версий библиотек не подходят, но работает, видимо типы не до конца были сделаны
    await this.cacheManager.set(`UserService.findOne ${id}`, user, {
      ttl: 1800,
    } as any);

    return user;
  }
  async axiosProxy() {
    const { data } = await firstValueFrom(
      this.httpService.get('https://dummyjson.com/products', {
        proxy: {
          protocol: 'http',
          host: '45.196.48.9',
          port: 5435,
          auth: {
            username: 'jtzhwqur',
            password: 'jnf0t0n2tecg',
          },
        },
      }),
    );
    return data;
  }
}
