import { getHEpisodes } from "../../data/players/h_players_data";
import { getLatEpisodes } from "../../data/players/lat_players_data";
import { getSubEpisodes } from "../../data/players/sub_players_data";

const episodeResolver = {
    Query : {
        getSubEpisodes(root:void,args:any){
            return getSubEpisodes(args.name,args.episode);
        },
        getLatEpisodes(root:void,args:any){
            return getLatEpisodes(args.name,args.episode);
        },
        getHEpisodes(root:void,args:any){
            return getHEpisodes(args.name,args.episode);
        }
    }
}

export default episodeResolver;