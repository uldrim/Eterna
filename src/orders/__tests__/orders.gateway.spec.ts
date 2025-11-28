import { OrdersGateway } from '../orders.gateway';

describe('OrdersGateway', () => {
  let gateway: OrdersGateway;

  beforeEach(() => {
    gateway = new OrdersGateway();
    gateway.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any;
  });

  it('sends status to correct room', () => {
    gateway.sendStatus('123', { status: 'routing' });

    expect(gateway.server.to).toHaveBeenCalledWith('123');
  });
});
