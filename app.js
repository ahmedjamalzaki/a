let secretKey = '';
let isSaleRunning = false;
let isBuyRunning = false;
let saleInterval;
let buyInterval;

// Load the secret key from localStorage if it exists
window.onload = function() {
    const storedSecretKey = localStorage.getItem('secretKey');
    if (storedSecretKey) {
        secretKey = storedSecretKey;
        document.getElementById('secretKey').value = secretKey;  // Display the stored key in the input field
        fetchAccountInfo();  // Fetch the account info based on the stored secret key
    }
};

// Save secretKey to localStorage whenever it changes
document.getElementById('secretKey').addEventListener('input', (event) => {
    secretKey = event.target.value;
    localStorage.setItem('secretKey', secretKey);  // Save the key to localStorage
    fetchAccountInfo();
});

async function fetchAccountInfo() {
    if (!secretKey) return;

    try {
        const response = await fetch(`https://mmbot.shop/api/get_account_info?secret_key=${secretKey}`);
        const data = await response.json();
        
        document.getElementById('accountBalance').textContent = data.balance_xlm || '-';
        document.getElementById('assetCount').textContent = data.number_of_assets || '-';
        
        // Swap sellOrders and buyOrders
        document.getElementById('sellOrders').textContent = data.buy_orders || '-';  // Display Buy Orders in Sell Orders field
        document.getElementById('buyOrders').textContent = data.sell_orders || '-';  // Display Sell Orders in Buy Orders field
    } catch (error) {
        console.error('Error fetching account info:', error);
    }
}

async function startSaleUpdate() {
    const waitTime = parseInt(document.getElementById('waitTime1').value);
    const startButton = document.querySelector('button[onclick="startSaleUpdate()"]');
    
    if (!secretKey || isSaleRunning) return;

    try {
        const response = await fetch(`https://mmbot.shop/api/start_code_1?secret_key=${secretKey}&wait_time=${waitTime}`);
        if (response.ok) {
            isSaleRunning = true;
            document.getElementById('saleStatus').textContent = 'Running';
            document.getElementById('saleStatus').classList.remove('stopped');
            document.getElementById('saleStatus').classList.add('running');
            
            // Start countdown timer
            let timeRemaining = waitTime;
            startButton.style.backgroundColor = "red";
            saleInterval = setInterval(() => {
                if (timeRemaining > 0) {
                    startButton.textContent = `Running (${timeRemaining}s)`;
                    timeRemaining--;
                } else {
                    clearInterval(saleInterval);
                    stopSaleUpdate();  // Auto-stop when time is up
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error starting sale update:', error);
    }
}

async function stopSaleUpdate() {
    const startButton = document.querySelector('button[onclick="startSaleUpdate()"]');

    if (!secretKey || !isSaleRunning) return;

    try {
        const response = await fetch(`https://mmbot.shop/api/stop_code_1?secret_key=${secretKey}`);
        if (response.ok) {
            isSaleRunning = false;
            document.getElementById('saleStatus').textContent = 'Stopped';
            document.getElementById('saleStatus').classList.remove('running');
            document.getElementById('saleStatus').classList.add('stopped');
            
            // Stop the countdown timer and reset button
            clearInterval(saleInterval);
            startButton.style.backgroundColor = "#00D1B2";
            startButton.textContent = "Start Sale Update";
        }
    } catch (error) {
        console.error('Error stopping sale update:', error);
    }
}

async function startBuyUpdate() {
    const waitTime = parseInt(document.getElementById('waitTime2').value);
    const startButton = document.querySelector('button[onclick="startBuyUpdate()"]');
    
    if (!secretKey || isBuyRunning) return;

    try {
        const response = await fetch(`https://mmbot.shop/api/start_code_2?secret_key=${secretKey}&wait_time=${waitTime}`);
        if (response.ok) {
            isBuyRunning = true;
            document.getElementById('buyStatus').textContent = 'Running';
            document.getElementById('buyStatus').classList.remove('stopped');
            document.getElementById('buyStatus').classList.add('running');
            
            // Start countdown timer
            let timeRemaining = waitTime;
            startButton.style.backgroundColor = "red";
            buyInterval = setInterval(() => {
                if (timeRemaining > 0) {
                    startButton.textContent = `Running (${timeRemaining}s)`;
                    timeRemaining--;
                } else {
                    clearInterval(buyInterval);
                    stopBuyUpdate();  // Auto-stop when time is up
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error starting buy update:', error);
    }
}

async function stopBuyUpdate() {
    const startButton = document.querySelector('button[onclick="startBuyUpdate()"]');

    if (!secretKey || !isBuyRunning) return;

    try {
        const response = await fetch(`https://mmbot.shop/api/stop_code_2?secret_key=${secretKey}`);
        if (response.ok) {
            isBuyRunning = false;
            document.getElementById('buyStatus').textContent = 'Stopped';
            document.getElementById('buyStatus').classList.remove('running');
            document.getElementById('buyStatus').classList.add('stopped');
            
            // Stop the countdown timer and reset button
            clearInterval(buyInterval);
            startButton.style.backgroundColor = "#00D1B2";
            startButton.textContent = "Start Buy Update";
        }
    } catch (error) {
        console.error('Error stopping buy update:', error);
    }
}
