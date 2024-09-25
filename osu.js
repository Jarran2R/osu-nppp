async function fetchData(type) {
    try {
        const url = "http://127.0.0.1:24050/json/v2"
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('tosu not found, ', response.status);
        }

        const data = await response.json();
        const beatmap = await data.beatmap;
        const play = await data.play;
        const state = await data.state;
        const profile = await data.profile;

        switch (type) {
            case ("mode"):
                return beatmap.mode.number ? profile.mode.number : beatmap.mode.number;
                break;
            case ("map"):
                let modeName;
                const modsName = play.mods.name ? ` +${play.mods.name}` : "";
                const id = beatmap.id ? `osu.ppy.sh/b/${beatmap.id}` : "(private map)";
                const modeNumber = beatmap.mode.number ? beatmap.mode.number : profile.mode.number;

                switch (modeNumber) {
                    case 0:
                        modeName = "";
                        break;
                    case 1:
                        modeName = " <osu!taiko>";
                        break;
                    case 2:
                        modeName = " <osu!catch>";
                        break;
                    case 3:
                        modeName = " <osu!mania>";
                    break;
                };

                const mapFormatted = `${beatmap.artist} - ${beatmap.title} [${beatmap.version}] (${beatmap.mapper})${modeName}${modsName} | ${id}`;
                return mapFormatted;
            case ("mods"):
                return play.mods.number;
                break;
            case ("pp"):
                if (document.getElementById("btmc").checked) {
                    return (state.number == 2 || state.number == 7) ? ` ${play.pp.current.toFixed(0)}pp /` : "";
                } else {
                    return (state.number == 2 || state.number == 7) ? ` ${play.pp.current.toFixed(2)}pp /` : "";
                }
        };
    } catch (error) {
        console.error('it brokey but differently: ', error);
        disconnectBot();
    };
};

async function calculatePp(acc) {
    try {
        const response = await fetch(`http://127.0.0.1:24050/api/calculate/pp?mode=${await fetchData("mode")}&acc=${acc}&mods=${await fetchData("mods")}`)

        if (!response.ok) {
            throw new Error('tosu not found, ', response.status);
        }
            
        const data = await response.json();
        if (document.getElementById("btmc").checked) {
            ppAmount = await data.pp.toFixed(0);
        } else {
            ppAmount = await data.pp.toFixed(2);
        }
        return ppAmount;
    } catch (error) {
        console.error('it brokey but differently: ', error);
        disconnectBot();
    };
};