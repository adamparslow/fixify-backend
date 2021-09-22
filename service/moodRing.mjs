export const getMoodRingData = async (spotifyApi) => {
    const likedSongs = await spotifyApi.getLikedSongs();

    const dateAndId = likedSongs.map(song => {
        return { 
            date: song.added_at.split("T")[0],
            id: song.track.id
        };
    });

    const audioFeatures = await spotifyApi.getAudioFeatures(dateAndId.map(obj => obj.id));

    const cumulative = [];
    let currentDate = "notAMatch";

    for (let i = 0; i < likedSongs.length; i++) {
        console.log(i);
        if (dateAndId[i].date !== currentDate) {
            currentDate = dateAndId[i].date
            cumulative.push({
                date: currentDate,
                features: []
            });
        } 

        cumulative[cumulative.length-1].features.push(audioFeatures[i]);
    }

    const averages = cumulative.map(({date, features}) => {
        const size = features.length
        const avgFeature =  {
            danceability: 0,
            energy: 0,
            loudness: 0,
            speechiness: 0,
            acousticness: 0,
            instrumentalness: 0,
            liveness: 0,
            valence: 0,
            tempo: 0
        };

        features.forEach(feature => {
            avgFeature.danceability += feature.danceability;            
            avgFeature.energy += feature.energy;            
            avgFeature.loudness += feature.loudness;            
            avgFeature.speechiness += feature.speechiness;            
            avgFeature.acousticness += feature.acousticness;            
            avgFeature.instrumentalness += feature.instrumentalness;            
            avgFeature.liveness += feature.liveness;            
            avgFeature.valence += feature.valence;            
            avgFeature.tempo += feature.tempo;            
        });

        avgFeature.danceability /= size;
        avgFeature.energy /= size;
        avgFeature.loudness /= size;
        avgFeature.speechiness /= size;
        avgFeature.acousticness /= size;
        avgFeature.instrumentalness /= size;
        avgFeature.liveness /= size;
        avgFeature.valence /= size;
        avgFeature.tempo /= size;

        return {
            date, 
            feature: avgFeature
        };
    });

    const sevenDayAverage = Array(averages.length)

    for (let i = 0; i < averages.length; i++) {
        let danceability = 0;
        if (i < 7) {
            for (let j = 0; j < i; j++) {
                danceability += averages[j].feature.danceability;
            }
            danceability /= (i+1);
        } else {
            for (let j = i - 7; j < i; j++) {
                danceability += averages[j].feature.danceability;
            }
            danceability /= 7;
        }

        console.log(danceability);
        sevenDayAverage[i] = {
            date: averages[i].date,
            feature: {
                danceabilitySmooth: danceability,
                danceability: averages[i].feature.danceability
            }
        };
    }

    console.log(sevenDayAverage);

    return sevenDayAverage;
};