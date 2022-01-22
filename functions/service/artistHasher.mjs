import { getListOfArtists } from './artistConcertPageStorage.mjs';

export const genNewArtistHashes = async () => {
    // get list of registered artists
    const artists = await getListOfArtists();
    console.log(artists);

    // generate new hash for each artist and update hash
}
