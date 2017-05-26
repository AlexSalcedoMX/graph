import tweets from '../../models/tweet_model';
import loggerUtil from './../../utils/logger';
import {Search} from '../../utils/validators';

const logger = loggerUtil.getInstance();

function getPercentage(obj){
    let sum = obj.reduce((previousValue, currentValue) => previousValue + currentValue.total, 0);
    let percentage = [];
    for(let index in obj){
        percentage[index] = {_id:obj[index]._id,percentage:Math.round((obj[index].total / sum)*100)};
    }
    return percentage;
}


function originalVsRts(root, args, context, _info){
    let search = new Search(args);

    return search.paramsValid().then(valid => {
        if(!valid){
            throw new Error('Request invalid');
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
            _id: "$verb",
            total: {
                $sum:1
            }
        })
        .exec()
    })
    .then(totalOriginalRt => {
        return getPercentage(totalOriginalRt); 
    })
    .catch(error => {
        logger.error(error);
        return error;
    })
}

export default {originalVsRts};
