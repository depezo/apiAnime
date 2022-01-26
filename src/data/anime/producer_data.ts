import { getDataAnimeSeason } from "./season_data";

export interface Producer {
    id:number
    description:String
}

export function getProducerAnimes(id:number,page:number){
    const url = 'https://myanimelist.net/anime/producer/' + id + "?page=" + page;
    return getDataAnimeSeason(url);
}