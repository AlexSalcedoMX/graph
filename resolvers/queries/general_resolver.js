import tweets from '../../models/tweet_model';
import loggerUtil from './../../utils/logger';
import {Search} from '../../utils/validators';

const logger = loggerUtil.getInstance();

function getNumberTweets(args){
    return tweets.find({
        busquedaId: args.searchId,
        postedTime: {
            $gte: new Date(args.initialDate),
            $lte: new Date(args.finalDate)
        }
    })
    .count()
    .exec()
    .then(tweets => {
        return tweets;
    })
    .catch(error => {
        logger.error(error);
    })
}

function getMentions(args){

    return tweets.aggregate()
    .match({
        busquedaId: args.searchId,
        postedTime: {
            $gte: new Date(args.initialDate),
            $lte: new Date(args.finalDate)
        }
    })
    .unwind("$menciones")
    .group({
        _id: "$menciones",
        total: {$sum : 1}
    })
    .exec()
    .then(mentions => {
        return mentions.length;
    })
    .catch(error => {
        logger.error(error);
    })
}

function getHashtags(args){
    return tweets.aggregate()
    .match({
        busquedaId: args.searchId,
        postedTime: {
            $gte: new Date(args.initialDate),
            $lte: new Date(args.finalDate)
        }
    })
    .unwind("$hashtags")
    .group({
        _id: "$hashtags",
        total: {$sum : 1}
    })
    .exec()
    .then(hashtags => {
        return hashtags.length;
    })
    .catch(error =>{
        logger.error(error);
    })
}

function getUsers(args){
   return tweets.aggregate()
    .match({
        busquedaId: args.searchId,
        postedTime: {
            $gte: new Date(args.initialDate),
            $lte: new Date(args.finalDate)
        }
    })
    .group({
        _id: '$usuario.preferredUsername'
    })
    .exec()
    .then(users => {
        return users.length;
    })
    .catch(error => {
        logger.error(error);
    })
}


function general(root, args, context, _info) {
    let search = new Search(args);

    return search.paramsValid().then(valid => {
        if( !valid ){
            throw new Error ('Invalid Request');
        }

        return Promise.all([
        getMentions(args),
        getHashtags(args),
        getUsers(args),
        getNumberTweets(args)
        ])

    })
    .then((all) => {
        return  {mentions: all[0],hashtags: all[1],users: all[2],tweets:all[3]};
    })
    .catch(error => {
        logger.error(error);
        return error;
    });
}

export default { general };
