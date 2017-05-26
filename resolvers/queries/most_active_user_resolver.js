import tweets from '../../models/tweet_model';
import loggerUtil from './../../utils/logger';
import {Search} from '../../utils/validators';

const logger = loggerUtil.getInstance();

function mostActiveUser(root,args,context,_info){
    let search = new Search(args);

    return search.paramsValid().then(valid => {
        if(!valid){
            throw new Error('Invalid Request');
        }

        return tweets
        .aggregate()
        .match({
            busquedaId: args.searchId,
            postedTime: {
                $gte: new Date(args.initialDate),
                $lte: new Date(args.finalDate)
            }
        })
        .group({
            _id: '$usuario.preferredUsername',
            total: { $sum: 1 }
        })
        .sort({
            total: -1
        })
        .limit(1)
        .exec()
    })
    .then(mostActiveUser => {
        return mostActiveUser[0];
    })
    .catch(error => {
        logger.error(error);
        return error;
    });
}

export default {mostActiveUser};
