import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@Processor('order-execution')
export class OrderWorker extends WorkerHost {
  private readonly logger = new Logger(OrderWorker.name);

  async process(job) {
    this.logger.log(
      `Processing job: ${job.data.orderId} with payload: ${JSON.stringify(job.data)}`,
    );
    return true;
  }
}
