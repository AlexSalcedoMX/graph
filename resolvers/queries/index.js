import generalResolvers from './general_resolver';
import mostActiveUserResolver from './most_active_user_resolver';
import hashtagResolver from './hashtag_resolver.js';
import originalVsRtResolver from './original_vs_rt_resolver';

const queriesResolvers = Object.assign({},
    generalResolvers,
    mostActiveUserResolver,
    hashtagResolver,
    originalVsRtResolver
    );

export default {
    Query: queriesResolvers
};
