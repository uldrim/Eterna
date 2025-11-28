import { OrdersGateway } from '../orders.gateway';

describe('WebSocket Flow', () => {
  it('sends message through gateway', () => {
    const gw = new OrdersGateway();
    gw.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any;

    gw.sendStatus('abc', { status: 'routing' });

    expect(gw.server.to).toHaveBeenCalledWith('abc');
    expect(gw.server.emit).toHaveBeenCalled();
  });
});
