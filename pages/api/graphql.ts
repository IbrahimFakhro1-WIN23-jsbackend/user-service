// pages/api/graphql.ts
import { ApolloServer, gql } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  origin: '*', // Tillåt alla ursprung
});

const typeDefs = gql`
  type Course {
    id: ID!
    title: String!
    description: String!
  }
  type Query {
    courses: [Course!]!
  }
`;

const resolvers = {
  Query: {
    courses: () => [
      { id: '1', title: 'Course 1', description: 'Description of course 1' },
      { id: '2', title: 'Course 2', description: 'Description of course 2' },
    ],
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default cors(async (req: NextApiRequest, res: NextApiResponse) => {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
