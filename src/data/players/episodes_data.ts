import { TinyAnime, TinyAnimeLA } from "../anime/anime_data";
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

export async function setLastEpisodeUploaded(tinyAnime: TinyAnimeLA, nameEpisode: String, url_img: String, episode: number, language: String, episodes: String[]) {
    let status = "";
    try {
        const leu = {} as LastEpisodeUploaded;
        leu.tinyAnime = tinyAnime;
        leu.nameEpisode = nameEpisode;
        leu.url_img = url_img;
        leu.episode = episode;
        const episodesA: Episode[] = [];
        for (let item of episodes){
            episodesA.push(await getEpisodesFromUrl(item,language));
        }
        leu.episodes = episodesA;
        await firestore.collection('last_episodes_uploaded').doc(tinyAnime.idAnime.toString()).collection(language).doc(episode.toString()).set(leu);
        await firestore.collection('last_episodes_uploaded').doc(tinyAnime.idAnime.toString()).set({
            tinyAnime: tinyAnime,
            nameEpisode: nameEpisode,
            url_img: url_img,
            episode: episode,
            language: language,
            episodes: episodesA,
            last_datetime_uploaded: FieldValue.serverTimestamp()
        });
        status = "ADDED";
    } catch (error) {
        console.log(error);
    }
    return status;
}

async function getEpisodesFromUrl(episode_url: String,language: String) {
    let new_url = episode_url.split('$#@*')[1];
    let type = 'secondary';
    const episode = {} as Episode;
    episode.language = language.toString();
    try {
        switch (episode_url.split('$#@*')[0]) {
            case 'fembed':
                new_url = episode_url.split('$#@*')[1];
                type = 'secondary'
                break;
            case 'mega':
                new_url = episode_url.split('$#@*')[1];
                type = 'secondary'
                break;
            case 'okru':
                new_url = episode_url.split('$#@*')[1].replace('/video/','/videoembed/');
                type = 'secondary'
                break;
            case 'yourupload':
                new_url = episode_url.split('$#@*')[1];
                type = 'secondary'
                break;
            case 'mp4upload':
                new_url = episode_url.split('$#@*')[1];
                type = 'secondary'
                break;
            case 'sendvid':
                new_url = episode_url.split('$#@*')[1];
                type = 'secondary'
                break;
        }
    } catch (error) {
        console.log(error);
    }
    episode.type = type;
    episode.url = new_url;
    return episode;
}