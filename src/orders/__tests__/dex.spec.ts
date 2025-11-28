import { DexRouter } from '../dex-router';
import { DexVenue } from '../enums/dex.enum';

describe('TestDexRouter', () => {
  const dex = new DexRouter();

  it('returns Raydium quotes within expected range', async () => {
    const q = await dex.getRaydiumQuote(100, 'SOL', 'USDC');

    expect(q.venue).toBe(DexVenue.RAYDIUM);
    expect(q.price).toBeGreaterThan(0.98);
    expect(q.price).toBeLessThanOrEqual(1.02);
  });

  it('returns Raydium quotes within expected range', async () => {
    const q = await dex.getMeteoraQuote(100, 'SOL', 'USDC');

    expect(q.venue).toBe(DexVenue.METEORA);
    expect(q.price).toBeGreaterThan(0.97);
    expect(q.price).toBeLessThanOrEqual(1.02);
  });
});
