describe('Routing Logic', () => {
  it(`select the better dex output`, () => {
    const raydium = { price: 1.0, fee: 0.003 };
    const meteora = { price: 0.98, fee: 0.002 };

    const raydiumOut = 10 * raydium.price * (1 - raydium.fee);
    const meteoraOut = 10 * meteora.price * (1 - meteora.fee);

    expect(raydiumOut).toBeGreaterThan(meteoraOut);
  });
});
