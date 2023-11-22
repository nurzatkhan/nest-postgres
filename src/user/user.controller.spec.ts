import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProcessor } from './user.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((v) => {
      return {
        message: 'SUCCES',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('check email ', () => {
    expect(
      controller.create({
        name: 'nurzatkhan',
        password: 'qwerty123',
        email: 'nurzatsj@gmail.com',
      }),
    ).toEqual({
      message: 'SUCCES',
    });
  });
});
