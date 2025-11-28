import { OrdersService } from '../orders.service';

describe('Queue retry options', () => {
  it('adds BullMQ job with retry/backoff', async () => {
    const orderRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockResolvedValue({ orderId: '999' }),
    };
    const historyRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn(),
    };
    const gateway = { sendStatus: jest.fn() };

    const queue = { add: jest.fn() };

    const service = new OrdersService(
      orderRepo as any,
      historyRepo as any,
      queue as any,
      gateway as any,
    );

    await service.createMarketOrder({
      tokenIn: 'SOL',
      tokenOut: 'USDC',
      amountIn: 10,
    });

    expect(queue.add).toHaveBeenCalledWith(
      'execute-order',
      { orderId: '999' },
      expect.objectContaining({
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      }),
    );
  });
});
