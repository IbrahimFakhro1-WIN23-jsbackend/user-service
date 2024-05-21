import { ApolloServer, gql } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    users: async () => [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ],
    user: async (_: any, { id }: { id: string }) => ({ id, name: `User ${id}`, email: `user${id}@example.com` }),
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string, email: string }) => ({ id: String(Date.now()), name, email }),
    updateUser: async (_: any, { id, name, email }: { id: string, name?: string, email?: string }) => ({ id, name: name || `User ${id}`, email: email || `user${id}@example.com` }),
    deleteUser: async (_: any, { id }: { id: string }) => ({ id, name: `Deleted User ${id}`, email: '' }),
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

const cors = Cors();

export default cors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
