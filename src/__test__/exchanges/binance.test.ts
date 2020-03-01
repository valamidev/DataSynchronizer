import { openSocket } from '../../exchange/ws_exchanges/binance_ws';

describe.only('Binance WS Handler', () => {
  let BinanceWS: any = {};
  const tradepairIDs = ['BTCUSDT', 'ETHBTC'];

  beforeEach(() => {
    BinanceWS = openSocket(tradepairIDs);
  });
  it('Should stop at call', async () => {
    // Arrange
    // Act
    const close = BinanceWS();
    // Assert
    expect(close).toBe(true);
  });
});
