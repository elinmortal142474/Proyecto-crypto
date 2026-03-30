/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  // const prices: number[] = data;
  // const windowSize: number = data.windowSize;

  const { id, prices, windowSize } = data; // Extrae las propiedades correctamente

  if (!prices || prices.length < windowSize) {
    postMessage(null);
    return;
  }

  const window = prices.slice(-windowSize);

  const mean =
    window.reduce((sum: number, price: number) => sum + price, 0) /
    window.length;

  const variance =
    window.reduce(
      (sum: number, price: number) => sum + Math.pow(price - mean, 2),
      0,
    ) / window.length;

  const volatility = Math.sqrt(variance);

  postMessage({
    id,
    mean,
    volatility,
  });
});
