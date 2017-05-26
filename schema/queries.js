const args = `searchId:ID!,initialDate:String!,finalDate:String!`;
const QUERY = `
    type Query {
        general(${args}): General

        mostActiveUser(${args}): MostActiveUser
        
        hashtags(${args}): [Hashtags]

        originalVsRts(${args}): [OriginalVsRts]
    }
`
export default QUERY;
