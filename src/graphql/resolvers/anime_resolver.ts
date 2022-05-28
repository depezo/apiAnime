import { getAnimeData, getBestReviewWeek, getComments, getPictures, getReviewsByAnime, setComment, setLikeReview, setLikesOrDislikes, setReview } from "../../data/anime/anime_data";

const animeResolver = {
    Query: {
        getAnime(root:void, args:any){
            return getAnimeData(args.id,args.hentai_status);
        },
        getPictures(root:void, args:any){
            return getPictures(args.url);
        },
        getComments(root: void, args: any){
            return getComments(args.id);
        },
        getReviewsByAnime(root: void, args: any){
            return getReviewsByAnime(args.id);
        },
        getBestReviewWeek(root: void, args: any){
            return getBestReviewWeek();
        }
    },
    Mutation: {
        setComment(root:void, args:any){
            return setComment(args.message,args.idUser,args.idAnime);
        },
        setLikesOrDislikes(root:void, args: any){
            return setLikesOrDislikes(args.idUser,args.type,args.idAnime,args.idComment);
        },
        setReview(root: void, args: any){
            return setReview(args.id,args.title,args.description,args.anime);
        },
        setLikeReview(root: void, args: any){
            return setLikeReview(args.idUser,args.type,args.idAnime,args.idReview);
        }
    }
}

export default animeResolver;