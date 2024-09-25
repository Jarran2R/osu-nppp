const EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';
// WebSocket will persist the application loop until you exit the program forcefully

var websocketClient;
var websocketSessionID;
var timeThen;

function startWebSocketClient() {
    websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

    websocketClient.onerror = (console.error);

    websocketClient.onopen = () => {
        console.log('WebSocket connection opened to ' + EVENTSUB_WEBSOCKET_URL);
    };

    websocketClient.onmessage = (data) => {
        console.log(data);
        try {
        handleWebSocketMessage(JSON.parse(data.data.toString()));
        } catch (error) {
            console.error("yo error")
            console.error(data.toString());
        };
    };
};

async function handleWebSocketMessage(data) {
    switch (data.metadata.message_type) {
        case 'session_welcome': // First message you get from the WebSocket server when connecting
            websocketSessionID = data.payload.session.id; // Register the Session ID it gives us

            // Listen to EventSub, which joins the chatroom from your bot's account
            registerEventSubListeners();
            break;
        case 'notification': // An EventSub notification has occurred, such as channel.chat.message
            switch (data.metadata.subscription_type) {
                case 'channel.chat.message':
                    console.log(`MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`);
                    if (document.getElementById("btmc").checked) {
                        switch (data.payload.event.message.text.trim().toLowerCase()) {
                            case "!np":
                                var timeNow = new Date().getTime();
                                if ((!timeThen) || (timeNow - timeThen > cooldown.value * 1000)) {
                                    sendChatMessage(`@${data.payload.event.chatter_user_name} | ${await fetchData("map")} |${await fetchData("pp")} 100%: ${await calculatePp(100)}pp, 99%: ${await calculatePp(99)}pp, 98%: ${await calculatePp(98)}pp, 95%: ${await calculatePp(95)}pp, 90%: ${await calculatePp(90)}pp`);
                                    timeThen = timeNow;
                                };
                                break;
                            }
                    } else {
                        switch (data.payload.event.message.text.trim().toLowerCase()) {
                            case "!nppp":
                                var timeNow = new Date().getTime();
                                if ((!timeThen) || (timeNow - timeThen > cooldown.value * 1000)) {
                                    sendChatMessage(`@${data.payload.event.chatter_user_name} | ${await fetchData("map")} |${await fetchData("pp")} 100%: ${await calculatePp(100)}pp, 99%: ${await calculatePp(99)}pp, 98%: ${await calculatePp(98)}pp, 95%: ${await calculatePp(95)}pp, 90%: ${await calculatePp(90)}pp`);
                                    timeThen = timeNow;
                                };
                                break;
                            case "!np":
                                var timeNow = new Date().getTime();
                                if ((!timeThen) || (timeNow - timeThen > cooldown.value * 1000)) {
                                    sendChatMessage(`@${data.payload.event.chatter_user_name} | ${await fetchData("map")}`);
                                    timeThen = timeNow;
                                };
                        };
                    break;
                    };
            };
            break;
    };
};