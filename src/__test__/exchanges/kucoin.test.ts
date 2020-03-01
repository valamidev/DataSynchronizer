import { openSocket } from '../../exchange/ws_exchanges/kucoin_ws';

describe.only('Kucoin WS Handler', () => {
  let KucoinWS: any = {};
  const tradepairIDs = ['BTCUSDT', 'ETHBTC'];

  beforeEach(() => {
    KucoinWS = openSocket(tradepairIDs);
  });
  it('Should stop at call', async () => {
    // Arrange
    // Act
    const close = KucoinWS();
    // Assert
    expect(close).toBe(true);
  });
});
