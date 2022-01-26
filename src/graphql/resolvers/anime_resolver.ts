import { getAnimeData, getPictures } from "../../data/anime/anime_data";

const animeResolver = {
    Query: {
        getAnime(root:void, args:any){
            return getAnimeData(args.id);
        },
        getPictures(root:void, args:any){
            return getPictures(args.url);
        }
    }
}

export default  animeResolver;