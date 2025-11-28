import { OrdersService } from '../orders.service';
import { OrderStatus } from '../enums/order-status.enum';

describe('updateOrderStatus()', () => {
  it('updates order, writes history, and emits WS event', async () => {
    const mockOrder = { orderId: '123', status: OrderStatus.PENDING };

    const orderRepo = { save: jest.fn().mockResolvedValue(mockOrder) };
    const historyRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn(),
    };
    const queue = { add: jest.fn() };
    const gateway = { sendStatus: jest.fn() };

    const service = new OrdersService(
      orderRepo as any,
      historyRepo as any,
      queue as any,
      gateway as any,
    );

    await service.updateOrderStatus(
      mockOrder,
      OrderStatus.SUBMITTED,
      'Submitting',
    );

    expect(orderRepo.save).toHaveBeenCalled();
    expect(historyRepo.save).toHaveBeenCalled();
    expect(gateway.sendStatus).toHaveBeenCalledWith('123', expect.any(Object));
  });
});
