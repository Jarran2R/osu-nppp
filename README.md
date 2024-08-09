# osu!nppp
[![GitHub License](https://img.shields.io/github/license/jarran2r/osu-nppp)](?tab=GPL-3.0-1-ov-file)
[![GitHub top language](https://img.shields.io/github/languages/top/jarran2r/osu-nppp)]()

osu!nppp | An osu! Twitch bot supporting !np and !nppp commands.
> [!IMPORTANT]
> Both osu! and [tosu](https://tosu.app) are __REQUIRED__ to be open and running for the bot to work properly, otherwise the bot will take an ungodly amount of time to respond and all values will show up as _undefined_.
## Usage
Visit [jarran2r.github.io/osu-nppp](https://jarran2r.github.io/osu-nppp) and follow the steps below.
1. Click the __Authorize__ button, and authorize the twitch account you want to use as the bot. The token is hidden to prevent accidental leaking.
2. Enter the name of the channel you want to listen for/respond to messages on into __Chat channel__.
3. Enter the command cooldown in seconds. _Default: 15s_
4. Click the __Connect__ button.

> [!NOTE]
> You may not change the token or channel name while the bot is connected, but you can change the cooldown.
## Format
`!np`:
> @Chatter | Artist - Title [Difficulty] (Mapper) &lt;Mode&gt;[^1] +Mods[^2] | osu.ppy.sh/b/BeatmapID

`!nppp`:
> @Chatter | Artist - Title [Difficulty] (Mapper) &lt;Mode&gt;[^1] +Mods[^2] | osu.ppy.sh/b/BeatmapID | ###pp[^3] / 100%: ###pp, 99%: ###pp, 98%: ###pp, 95%: ###pp, 90%: ###pp
[^1]: Mode is only visible if it is not osu!standard.
[^2]: Mods are only visible if any are selected.
[^3]: Current pp, only visible if the player is currently playing a map.
