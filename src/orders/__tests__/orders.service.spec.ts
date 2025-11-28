import { OrdersService } from '../orders.service';
import { OrdersGateway } from '../orders.gateway';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';

describe('OrdersService', () => {
  let service: OrdersService;
  let gateway: OrdersGateway;

  let orderRepo: any;
  let historyRepo: any;

  beforeEach(() => {
    orderRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockResolvedValue({ orderId: '1' }),
    };

    historyRepo = {
      save: jest.fn(),
      create: jest.fn().mockReturnValue({}),
    };

    gateway = new OrdersGateway();
    gateway.sendStatus = jest.fn();

    service = new OrdersService(
      orderRepo as any,
      historyRepo as any,
      { add: jest.fn() } as any,
      gateway,
    );
  });

  it('saves and emits pending status', async () => {
    const dto = { tokenIn: 'SOL', tokenOut: 'USDC', amountIn: 1 };

    await service.createMarketOrder(dto);

    expect(gateway.sendStatus).toHaveBeenCalledWith('1', {
      orderId: '1',
      status: OrderStatus.PENDING,
      details: 'Order received',
    });
  });
});
