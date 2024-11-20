function fetchBitcoinPrice() {
  fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(response => response.json())
    .then(data => {
      const btcUsd = data.bpi.USD.rate_float.toFixed(2);
      const btcCad = (btcUsd * 1.25).toFixed(2); // Assuming approximate conversion
      updateDisplay(`BTC/USD: ${btcUsd}   BTC/CAD: ${btcCad}`);
    })
    .catch(error => console.error('Error fetching Bitcoin price:', error));
}

function updateDisplay(textContent) {
  document.body.innerHTML = `<div style="font-size: 24px; color: white; text-align: center; margin-top: 20%;">${textContent}</div>`;
}

// Fetch the Bitcoin price immediately and then every 20 seconds
fetchBitcoinPrice();
setInterval(fetchBitcoinPrice, 20000);
