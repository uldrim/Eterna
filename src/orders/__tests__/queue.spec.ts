import { OrdersService } from '../orders.service';
import { OrderStatus } from '../enums/order-status.enum';

describe('Queue behavior', () => {
  it('adds job to BullMQ queue during order creation', async () => {
    const mockOrder = { orderId: '1' };

    const orderRepo = {
      create: jest.fn().mockReturnValue(mockOrder),
      save: jest.fn().mockResolvedValue(mockOrder),
    };

    const historyRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn(),
    };

    const queue = {
      add: jest.fn().mockResolvedValue({}),
    };

    const gateway = {
      sendStatus: jest.fn(),
    };

    const service = new OrdersService(
      orderRepo as any,
      historyRepo as any,
      queue as any,
      gateway as any,
    );

    await service.createMarketOrder({
      tokenIn: 'SOL',
      tokenOut: 'USDC',
      amountIn: 1,
    });

    // Make sure queue.add was called with correct payload
    expect(queue.add).toHaveBeenCalledWith(
      'execute-order',
      { orderId: '1' },
      expect.any(Object), // retry settings
    );

    expect(gateway.sendStatus).toHaveBeenCalledWith('1', {
      orderId: '1',
      status: OrderStatus.PENDING,
      details: 'Order received',
    });
  });
});
