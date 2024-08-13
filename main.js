const token = document.getElementById("token");
const authorize = document.getElementById("authorize");
const username = document.getElementById("username");
const connect = document.getElementById("connect");
const cooldown = document.getElementById("cooldown");
const message = document.getElementById("message");

token.value = OAUTH_TOKEN;

if (OAUTH_TOKEN) {
    console.log("OAuth Token: ", OAUTH_TOKEN);
};

function makeValid() {
    username.classList.remove("invalid"); // this is purely for cosmetics
};

function disableForms(value) {
    token.disabled = value;
    authorize.disabled = value;
    username.disabled = value;
    connect.disabled = value;
};

// Start executing the bot from here
function connectBot() {
    disableForms(true);
    connect.innerHTML = "Connecting";
    message.textContent = "";
    if (OAUTH_TOKEN) {
        (async () => {
            // Verify that the authentication is valid
            try {
                await getAuth();
                await getUserId();
                await getBotId();
                // Start WebSocket client and register handlers
                startWebSocketClient();
            } catch (error) {
                console.error(error);
                disconnectBot();
            };
        })();
    } else {
        token.classList.add("invalid");
        message.textContent = "No token provided";
        console.error("No token provided");
        disconnectBot();
    };
};

function disconnectBot() {
    try {
        websocketClient.close();
        console.log("Connection closed for " + EVENTSUB_WEBSOCKET_URL)
    } catch (error) {
        console.error("No WebSocket to close")
    }

    disableForms(false);
    connect.disabled = false;
    connect.innerHTML = "Connect";
    connect.onclick = function() { connectBot() };
};