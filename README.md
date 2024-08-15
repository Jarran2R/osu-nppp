<p align="center">
  <img width="512" src="assets/logo/osu!nppp.png">
</p>

# osu!nppp

[![GitHub License](https://img.shields.io/github/license/jarran2r/osu-nppp)](LICENSE)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/jarran2r/osu-nppp)](https://github.com/Jarran2R/osu-nppp/issues)
[![GitHub Release](https://img.shields.io/github/v/release/jarran2r/osu-nppp)](https://github.com/Jarran2R/osu-nppp/releases)
[![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/jarran2r/osu-nppp)](https://www.codefactor.io/repository/github/jarran2r/osu-nppp/)

osu!nppp | An osu! Twitch bot supporting !np and !nppp commands.
> [!IMPORTANT]
> Both osu! and [tosu](https://tosu.app) are __REQUIRED__ to be open and running for the bot to work properly, otherwise the bot will eventually disconnect after sending a command.

All code is ran client-sided, and no information is sent/stored to any server other than Twitch.
## Usage
Visit [jarran2r.github.io/osu-nppp](https://jarran2r.github.io/osu-nppp) and follow the steps below.
1. Click the __Authorize__ button, and authorize the twitch account you want to use as the bot. The token is hidden to prevent accidental leaking.
2. Enter the name of the channel you want to listen for/respond to messages on in __Channel__.
3. Enter the command cooldown in seconds. _Default: 15s_
4. Click the __Connect__ button.

> [!NOTE]
> You may not change the token or channel name while the bot is connected, but you can change the cooldown.
## Format
`!np`:
> @Sender | Artist - Title [Difficulty] (Mapper) &lt;Mode&gt;* +Mods** | osu.ppy.sh/b/BeatmapID

`!nppp`:
> @Sender | Artist - Title [Difficulty] (Mapper) &lt;Mode&gt;* +Mods** | osu.ppy.sh/b/BeatmapID | ###pp*** / 100%: ###pp, 99%: ###pp, 98%: ###pp, 95%: ###pp, 90%: ###pp

<sup>_*Mode is only visible if it is not osu!standard._</sup>  
<sup>_**Mods are only visible if any are selected._</sup>  
<sup>_***Current pp, only visible if the player is currently playing a map._</sup>
## Roadmap
- [ ] Add `!pp` command for calculating user-defined accuracy of the current beatmap
- [ ] Add ability to customize command message
- [x] Make commands not case-sensitive
- [x] Organize
  - [x] Site
  - [x] Code
## License
osu!nppp is released under the [GNU General Public License v3.0](LICENSE). See `LICENSE` for more info.
