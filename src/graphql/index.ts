import { GraphQLSchema } from "graphql";
import 'graphql-import-node';
import { mergeSchemas } from "@graphql-tools/schema";

//Resolvers
import animeResolver from "./resolvers/anime_resolver";
import charactersResolver from "./resolvers/character_resolver";
import actorResolver from "./resolvers/actor_resolver";
import seasonResolver from "./resolvers/season_resolver";
import topResolvers from "./resolvers/top_resolver";
import searchResolver from "./resolvers/search_resolver";
import genresResolver from "./resolvers/genres_resolver";
import episodeResolver from "./resolvers/episode_resolver";
import scheduleResolver from "./resolvers/schedule_resolver";

//Schemas
import anime from "./schemas/anime.graphql";
import genre from "./schemas/genre.graphql";
import character from "./schemas/character.graphql";
import actor from "./schemas/actor.graphql";
import producer from "./schemas/producer.graphql";
import season from "./schemas/season.graphql";
import top from "./schemas/top.graphql";
import search from "./schemas/search.graphql";
import episode from "./schemas/episode.graphql";
import producerResolver from "./resolvers/producerResolver";
import schedule from "./schemas/schedule.graphql";

export const schema: GraphQLSchema = mergeSchemas({
    typeDefs: [
        anime,
        genre,
        character,
        actor,
        season,
        producer,
        top,
        search,
        episode,
        schedule
    ],
    resolvers: [
        animeResolver,
        charactersResolver,
        actorResolver,
        seasonResolver,
        topResolvers,
        searchResolver,
        genresResolver,
        producerResolver,
        episodeResolver,
        scheduleResolver
    ]
});