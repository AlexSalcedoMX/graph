import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';

import { apolloKoa, graphiqlKoa } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';

import graphqlTypes from './../../types';
import graphqlQueries from './../../schema/queries';
import graphqlSchema from './../../schema/schema';
import graphqlResolvers from './../../resolvers';

import loggerUtil from './../../utils/logger';

const logger = loggerUtil.getInstance();


function init() {
    const APP = new Koa();
    const router = new KoaRouter();

    APP.use(koaBody());

    const graphQLSchema = makeExecutableSchema({
        typeDefs: [graphqlSchema, graphqlQueries, graphqlTypes],
        resolvers: graphqlResolvers
    });

    router.post('/graph', (ctx, next) => apolloKoa(() => ({
        schema: graphQLSchema
    }))(ctx, next));
    
    if (process.env.GRAPHIQL === 'true') {
        router.get('/graphiql', graphiqlKoa({
            endpointURL: '/graph'
        }));
    }

    APP.use(router.routes());
    APP.use(router.allowedMethods());
    APP.listen(process.env.PORT, () => {
        logger.info('%s listening at %s', process.env.APP_NAME, process.env.PORT);
    });
}

export default init;
