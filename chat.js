async function sendChatMessage(chatMessage) {
    let response = await fetch('https://api.twitch.tv/helix/chat/messages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OAUTH_TOKEN,
            'Client-Id': CLIENT_ID,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            broadcaster_id: CHAT_CHANNEL_USER_ID,
            sender_id: BOT_USER_ID,
            message: chatMessage
        })
    });

    if (response.status != 200) {
        let data = await response.json();
        console.error("Failed to send chat message");
        console.error(data);
    } else {
        console.log("Sent chat message: " + chatMessage);
    };
};

async function registerEventSubListeners() {
    // Register channel.chat.message
    let response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OAUTH_TOKEN,
            'Client-Id': CLIENT_ID,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'channel.chat.message',
            version: '1',
            condition: {
                broadcaster_user_id: CHAT_CHANNEL_USER_ID,
                user_id: BOT_USER_ID
            },
            transport: {
                method: 'websocket',
                session_id: websocketSessionID
            }
        })
    });

    if (response.status != 202) {
        let data = await response.json();
        console.error("Failed to subscribe to channel.chat.message. API call returned status code " + response.status);
        console.error(data);

        disconnectBot();
    } else {
        const data = await response.json();
        console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);

        connect.disabled = false;
        connect.innerHTML = "Disconnect";
        connect.onclick = function() { disconnectBot() };
    };
};