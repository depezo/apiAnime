import { getLastEpisodeUploaded, setLastEpisodeUploaded } from "../../data/players/episodes_data";
import { getHEpisodes } from "../../data/players/h_players_data";
import { getLatEpisodes } from "../../data/players/lat_players_data";
import { getSubEpisodes } from "../../data/players/sub_players_data";

const episodeResolver = {
    Query : {
        getSubEpisodes(root:void,args:any){
            return getSubEpisodes(args.name,args.episode,args.idAnime);
        },
        getLatEpisodes(root:void,args:any){
            return getLatEpisodes(args.name,args.episode,args.idAnime);
        },
        getHEpisodes(root:void,args:any){
            return getHEpisodes(args.name,args.episode);
        },
        getLastEpisodeUploaded(root:void,args:any){
            return getLastEpisodeUploaded(args.idAnime);
        }
    },
    Mutation: {
        setLastEpisodeUploaded(root: void, args: any){
            return setLastEpisodeUploaded(args.tinyAnime,args.nameEpisode,args.url_img,args.episode,args.language,args.episodes);
        }
    }
}

export default episodeResolver;