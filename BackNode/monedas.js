const conRedis = require("./redis");
const conf = require("./config");

const binance = require("node-binance-api")().options({
  APIKEY: conf.BinanceApiKey,
  APISECRET: conf.BinanceApiSecret,
  useServerTime: true
});

const getBalance = () => {
  Symbols = [];
  binance.balance(async (error, balances) => {
    if (error) return console.error(error);

    for (const prop in balances) {
      if (prop !== "USDT" && prop !== "BTC") Symbols.push(prop + "BTC");
      else if (prop === "BTC") Symbols.push(prop + "USDT");
    }

    await setRedis("Symbols", Symbols);
  });
};

const setRedis = (llave, datos) => {
  red = new conRedis();
  return new Promise((resolve, reject) => {
    try {
      red.client.set(llave, JSON.stringify(datos), (err, object) => {
        if (red.client) red.client.quit();

        if (err) {
          reject(err);
        } else {
          resolve(object);
        }
      });
    } catch (error) {
      if (red.client) red.client.quit();

      console.log("error", error);
    }
  });
};

getBalance();
