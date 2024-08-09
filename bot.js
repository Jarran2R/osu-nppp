const CLIENT_ID = 'dl6k4oj0aiuyymn19opsclt6xyykbc';

var BOT_USER_ID; // This is the User ID of the chat bot
var CHAT_CHANNEL_USER_ID; // This is the User ID of the channel that the bot will join and listen to chat messages of

function verifyUrl() {
    let hash;
    try {
        hash = window.location.hash.split('access_token=')[1].split('&')[0];
    } catch (error) {
        hash = ""
    }
    return hash;
}

const OAUTH_TOKEN = verifyUrl();

document.getElementById("token").value = OAUTH_TOKEN;
console.log("OAuth Token: ", OAUTH_TOKEN);

const EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';
var websocketClient;
var websocketSessionID;
var timeThen;

// Start executing the bot from here
function connectBot() {
    document.getElementById("token").disabled = true;
    document.getElementById("authorize").disabled = true;
    document.getElementById("username").disabled = true;
    document.getElementById("connect").disabled = true;
    document.getElementById("connect").innerHTML = "Connecting";
    if (OAUTH_TOKEN) {
        (async () => {
            // Verify that the authentication is valid
            await getAuth();
            await getUserId();
            await getBotId();

            // Start WebSocket client and register handlers
            startWebSocketClient();
        })();
    } else {
        console.error("No token provided")
        disconnectBot();
    }

    // WebSocket will persist the application loop until you exit the program forcefully

    async function getUserId() {
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${document.getElementById("username").value}`, {
            method: 'GET',
            headers: {
                'Client-Id': CLIENT_ID,
                'Authorization': 'Bearer ' + OAUTH_TOKEN
            }
        });

        let data = await response.json();
        if (response.status == 401) {
            console.error("No OAuth token provided");
            disconnectBot();
        };
        try {
        CHAT_CHANNEL_USER_ID = data.data[0].id;
        console.log("Channel ID: ", CHAT_CHANNEL_USER_ID);
        } catch (error) {
            console.error("Invalid username, " + error);
            disconnectBot();
        };
    };

    async function getBotId() {
        const response = await fetch('https://api.twitch.tv/helix/users', {
            method: 'GET',
            headers: {
                'Client-Id': CLIENT_ID,
                'Authorization': 'Bearer ' + OAUTH_TOKEN
            }
        });

        let data = await response.json();
        if (response.status == 401) {
            console.error("No OAuth token provided");
            disconnectBot();
        }
        try {
            BOT_USER_ID = data.data[0].id;
            console.log("Bot ID: ", BOT_USER_ID);
        } catch (error) {
            console.error(error);
            disconnectBot();
        }
    }

    async function getAuth(token) {
        // https://dev.twitch.tv/docs/authentication/validate-tokens/#how-to-validate-a-token
        let response = await fetch('https://id.twitch.tv/oauth2/validate', {
            method: 'GET',
            headers: {
                'Authorization': 'OAuth ' + OAUTH_TOKEN
            }
        });

        if (response.status != 200) {
            let data = await response.json();
            console.error("Token is not valid. /oauth2/validate returned status code " + response.status);
            console.error(data);
            disconnectBot();
        }

        console.log("Validated token.");
    }

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
            }
        };
    }

    async function fetchData(type) {
        try {
            const url = "http://127.0.0.1:24050/json/v2"
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error('it brokey', response.status);
            }

            const data = await response.json();
            const beatmap = await data.beatmap;
            const play = await data.play;
            const state = await data.state;
            const profile = await data.profile;

            switch (type) {
                case ("mode"):
                    let mode = beatmap.mode.number
                    if (beatmap.mode.number == 0) {
                        mode = profile.mode.number;
                    }
                    return mode;
                    break;
                case ("map"):
                    let modsName = "";
                    if (play.mods.name) {
                        modsName = ` +${play.mods.name}`
                    }
                    let id = "(private map)";
                    if (beatmap.id) {
                        id = `osu.pp.sh/b/${beatmap.id}`
                    }
                    let modeName = ""
                    let modeNumber = beatmap.mode.number
                    if (beatmap.mode.number == 0) {
                        modeNumber = profile.mode.number;
                    }
                    switch (modeNumber) {
                        case 0:
                            modeName = ""
                            break;
                        case 1:
                            modeName = " <osu!taiko>"
                            break;
                        case 2:
                            modeName = " <osu!catch>"
                            break;
                        case 3:
                            modeName = " <osu!mania>"
                        break;
                    }
                    const mapFormatted = `${beatmap.artist} - ${beatmap.title} [${beatmap.version}] (${beatmap.mapper})${modeName}${modsName} | ${id}`
                    return mapFormatted;
                    break;
                case ("mods"):
                    const modsNumber = play.mods.number;
                    return modsNumber;
                    break;
                case ("pp"):
                    let currentPp = ""
                    if (state.number == 2 || state.number == 7) {
                        currentPp = ` ${play.pp.current.toFixed(2)}pp /`
                    }
                    return currentPp;
            }
        }

        catch (error) {
            console.error('it brokey but differently', error);
        };
    }

    async function calculatePp(acc) {
        try {
            const response = await fetch(`http://127.0.0.1:24050/api/calculate/pp?mode=${await fetchData("mode")}&acc=${acc}&mods=${await fetchData("mods")}`)

            if (!response.ok) {
                throw new Error('it brokey', response.status);
            }
                
            const data = await response.json();
            let ppAmount = await data.pp.toFixed(2);
            return ppAmount;
        }

        catch (error) {
            console.error('it brokey but differently', error);
        };
    }

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
                        // First, print the message to the program's console.
                        console.log(`MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`);

                        // Then check to see if that message was "HeyGuys"
                        switch (data.payload.event.message.text.trim()) {
                            // If so, send back "VoHiYo" to the chatroom
                            case "!nppp":
                                const timeNow = new Date().getTime()
                                if ((!timeThen) || (timeNow - timeThen > document.getElementById("cooldown").value * 1000)) {
                                    sendChatMessage(`@${data.payload.event.chatter_user_name} | ${await fetchData("map")} |${await fetchData("pp")} 100%: ${await calculatePp(100)}pp, 99%: ${await calculatePp(99)}pp, 98%: ${await calculatePp(98)}pp, 95%: ${await calculatePp(95)}pp, 90%: ${await calculatePp(90)}pp`);
                                    timeThen = timeNow;
                                }
                                break;
                            case "!np":
                                if ((!timeThen) || (timeNow - timeThen > document.getElementById("cooldown").value * 1000)) {
                                    sendChatMessage(`@${data.payload.event.chatter_user_name} | ${await fetchData("map")}`)
                                    timeThen = timeNow;
                                }
                            break;
                        }

                        break;
                }
                break;
        }
    }

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
        }
    }

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
            let button = document.getElementById("connect")
            console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
            button.disabled = false
            button.innerHTML = "Disconnect"
            button.onclick = function() { disconnectBot() };
        }
    }
    async function disconnectBot() {
        let button = document.getElementById("connect")
        try {
            websocketClient.close();
            console.log("Connection closed for " + EVENTSUB_WEBSOCKET_URL)
        } catch (error) {
            console.error("No WebSocket to close")
        }
        document.getElementById("token").disabled = false
        document.getElementById("authorize").disabled = false
        document.getElementById("username").disabled = false
        button.disabled = false
        button.innerHTML = "Connect"
        button.onclick = function() { connectBot() };
    }
}