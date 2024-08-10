const CLIENT_ID = 'dl6k4oj0aiuyymn19opsclt6xyykbc';
const OAUTH_TOKEN = window.location.hash.split('access_token=')[1] ? window.location.hash.split('access_token=')[1].split('&')[0] : "";

var BOT_USER_ID; // This is the User ID of the chat bot
var CHAT_CHANNEL_USER_ID; // This is the User ID of the channel that the bot will join and listen to chat messages of

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
        throw new Error("Token is not valid. /oauth2/validate returned status code " + response.status);
    };

    console.log("Validated token.");
};

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
        throw new Error("No OAuth token provided");
    };
    try {
    CHAT_CHANNEL_USER_ID = data.data[0].id;
    console.log("Channel ID: ", CHAT_CHANNEL_USER_ID);
    } catch (error) {
        throw new Error("Invalid username, " + error);
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
        throw new Error("No OAuth token provided");
    }
    try {
        BOT_USER_ID = data.data[0].id;
        console.log("Bot ID: ", BOT_USER_ID);
    } catch (error) {
       throw new Error(error);
    };
};