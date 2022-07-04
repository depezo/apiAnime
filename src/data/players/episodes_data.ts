import { TinyAnime, TinyAnimeLA } from "../anime/anime_data";
import { getPrimaryAndDownload } from "./lat_players_data";
import { Episode } from "./sub_players_data";

const admin = require('firebase-admin');
const firestore = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

interface LastEpisodeUploaded {
    tinyAnime: TinyAnimeLA
    nameEpisode: String
    url_img: String
    episode: number
    language: String
    episodes: Episode[]
}

export async function getLastEpisodeUploaded(idAnime: number){
    let episodes: Episode[] = [];
    try {
        const data = await firestore.collection('last_episodes_uploaded').doc(idAnime.toString()).get();
        if (data.exists) {
            episodes = data.get('episodes');
            episodes = await getPrimaryAndDownload(episodes);
        }
    } catch (error) {
        console.log(error);
    }
    return episodes;
}

export async function setLastEpisodeUploaded(tinyAnime: TinyAnimeLA, nameEpisode: String, url_img: String, episode: number, language: String, episodes: Episode[]) {
    let status = "";
    try {
        const leu = {} as LastEpisodeUploaded;
        leu.tinyAnime = tinyAnime;
        leu.nameEpisode = nameEpisode;
        leu.url_img = url_img;
        leu.episode = episode;
        /*const episodesA: Episode[] = [];
        for (let item of episodes) {
            episodesA.push(await getEpisodesFromUrl(item, language,isDownloable,download_url,type_download));
        }*/
        leu.episodes = episodes;
        await firestore.collection('last_episodes_uploaded').doc(tinyAnime.idAnime.toString()).collection(language).doc(episode.toString()).set(leu);
        await firestore.collection('last_episodes_uploaded').doc(tinyAnime.idAnime.toString()).set({
            tinyAnime: tinyAnime,
            nameEpisode: nameEpisode,
            url_img: url_img,
            episode: episode,
            language: language,
            episodes: episodes,
            last_datetime_uploaded: FieldValue.serverTimestamp()
        });
        status = "ADDED";
    } catch (error) {
        console.log(error);
    }
    return status;
}

async function getEpisodesFromUrl(episode_url: String, language: String,isDownloable: Boolean,download_url: String,type_download: String) {
    let new_url = episode_url.split('$#@*')[1];
    let type = 'secondary';
    const episode = {} as Episode;
    episode.language = language.toString();
    try {
        switch (episode_url.split('$#@*')[0]) {
            case 'primary':
                new_url = episode_url.split('$#@*')[1];
                type = 'primary'
                break;
            case 'secondary':
                new_url = episode_url.split('$#@*')[1];
                type = 'secondary'
                break;
        }
    } catch (error) {
        console.log(error);
    }
    episode.type = type;
    episode.url = new_url;
    episode.downloable = isDownloable;
    episode.url_download = download_url;
    episode.type_downloable = type_download;
    return episode;
}