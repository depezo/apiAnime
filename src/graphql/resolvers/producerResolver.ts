import { getProducerAnimes } from "../../data/anime/producer_data";

const producerResolver = {
    Query: {
        getProducerAnimes(root:void,args:any){
            return getProducerAnimes(args.id,args.page);
        }
    }
}

export default producerResolver;