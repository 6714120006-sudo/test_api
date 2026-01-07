const BTC_API =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,thb";

const API_KEY = "";

const ETH_USD_API =
    `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=ETH&to_currency=USD&apikey=${API_KEY}`;

const ETH_EUR_API =
    `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=ETH&to_currency=EUR&apikey=${API_KEY}`;

const USD_THB_API =
    `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=THB&apikey=${API_KEY}`;

async function fetchPrices() {
    try {
        // ===== BTC =====
        const btcResponse = await fetch(BTC_API);
        const btcData = await btcResponse.json();

        document.getElementById("btc-usd").textContent =
            `$${btcData.bitcoin.usd.toLocaleString()}`;

        document.getElementById("btc-eur").textContent =
            `€${btcData.bitcoin.eur.toLocaleString()}`;

        document.getElementById("btc-thb").textContent =
            `฿${btcData.bitcoin.thb.toLocaleString()}`;

        // ===== ETH =====
        const [usdRes, eurRes, thbRateRes] = await Promise.all([
            fetch(ETH_USD_API),
            fetch(ETH_EUR_API),
            fetch(USD_THB_API)
        ]);

        const usdData = await usdRes.json();
        const eurData = await eurRes.json();
        const thbRateData = await thbRateRes.json();

        const ethUsd =
            Number(usdData["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);

        const ethEur =
            Number(eurData["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);

        const usdThb =
            Number(thbRateData["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);

        const ethThb = ethUsd * usdThb;

        document.getElementById("eth-usd").textContent =
            `$${ethUsd.toFixed(2)}`;

        document.getElementById("eth-eur").textContent =
            `€${ethEur.toFixed(2)}`;

        document.getElementById("eth-thb").textContent =
            `฿${ethThb.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

        document.getElementById("lastUpdate").textContent =
            `อัปเดตล่าสุด: ${new Date().toLocaleTimeString()}`;

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        document.getElementById("lastUpdate").textContent =
            "เกิดข้อผิดพลาดในการดึงข้อมูล";
    }
}

document.getElementById("refreshBtn")
    .addEventListener("click", fetchPrices);

fetchPrices();
setInterval(fetchPrices, 60000);
