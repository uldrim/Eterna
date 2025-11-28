import { OrderWorker } from '../order.worker';
import { OrderStatus } from '../enums/order-status.enum';

// Mock DexRouter so worker doesn’t sleep for 2 seconds
jest.mock('../dex-router', () => {
  return {
    DexRouter: jest.fn().mockImplementation(() => ({
      getRaydiumQuote: jest.fn().mockResolvedValue({
        venue: 'Raydium',
        price: 1.0,
        fee: 0.003,
      }),
      getMeteoraQuote: jest.fn().mockResolvedValue({
        venue: 'Meteora',
        price: 0.8,
        fee: 0.002,
      }),
      executeSwap: jest.fn().mockResolvedValue({
        txHash: 'mock_tx_hash',
        executedPrice: 1.01,
      }),
    })),
  };
});

describe('OrderWorker', () => {
  let worker: OrderWorker;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      updateOrderStatus: jest.fn(),
    };

    const mockOrderRepo = {
      findOneBy: jest.fn().mockResolvedValue({
        orderId: '1',
        amountIn: 10,
        tokenIn: 'SOL',
        tokenOut: 'USDC',
        status: OrderStatus.PENDING,
      }),
    };

    worker = new OrderWorker(mockService, mockOrderRepo as any);
  });

  it('processes an order end-to-end without throwing', async () => {
    const job = { data: { orderId: '1' } } as any;

    await expect(worker.process(job)).resolves.not.toThrow();

    // Expect worker lifecycle updates
    expect(mockService.updateOrderStatus).toHaveBeenCalledWith(
      expect.any(Object),
      OrderStatus.ROUTING,
      expect.any(String),
    );

    expect(mockService.updateOrderStatus).toHaveBeenCalledWith(
      expect.any(Object),
      OrderStatus.BUILDING,
      expect.any(String),
    );

    expect(mockService.updateOrderStatus).toHaveBeenCalledWith(
      expect.any(Object),
      OrderStatus.SUBMITTED,
      expect.any(String),
    );

    expect(mockService.updateOrderStatus).toHaveBeenCalledWith(
      expect.any(Object),
      OrderStatus.CONFIRMED,
      expect.any(String),
    );
  });
});
