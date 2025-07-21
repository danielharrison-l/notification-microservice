import { Test, TestingModule } from '@nestjs/testing';
import { RmqProcessController } from './rmq-process.controller';
import { RmqProcessService } from './rmq-process.service';

describe('RmqProcessController', () => {
  let rmqProcessController: RmqProcessController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RmqProcessController],
      providers: [RmqProcessService],
    }).compile();

    rmqProcessController = app.get<RmqProcessController>(RmqProcessController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rmqProcessController.getHello()).toBe('Hello World!');
    });
  });
});
