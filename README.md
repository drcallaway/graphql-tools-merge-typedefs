# graphql-tools-merge-typedefs
This library is used to merge GraphQL query, mutation, and subscription type definitions that are specified in separate files.

## Installation
```shell
npm install graphql-tools-merge-typedefs
```
or
```shell
yarn add graphql-tools-merge-typedefs
```

## Usage
Imagine the following schema definition file named `customer-schema.js`:
```js
const { gql } = require('apollo-server');
const customersData = require('./json/customers.json');

const customer = gql`
  type Customer {
    id: ID!
    firstName: String!
    lastName: String!
  }
`;

const query = gql`
  type Query {
    customer(id: ID!): Customer
  }
`;

const resolvers = {
  Query: {
    customer: (obj, args) => customersData.find(customer => customer.id === args.id)
  }
};

exports.types = [ customer, query ];
exports.resolvers = resolvers;
```
And another schema definition file named `order-schema.js`:
```js
const { gql } = require('apollo-server');
const ordersData = require('./json/orders.json');

const order = gql`
  type Order {
    id: ID!
    product: String!
    quantity: Int!
  }
`;

const query = gql`
  type Query {
    order(id: ID!): Order
  }
`;

const resolvers = {
  Query: {
    order: (obj, args) => ordersData.find(order => order.id === args.id)
  }
};

exports.types = [ order, query ];
exports.resolvers = resolvers;
```
Merging these two files using the [graphql-tools](https://github.com/apollographql/graphql-tools) `makeExecutableSchema` function would result in a merge conflict since both `customer-schema.js` and `order-schema.js` files include a "Query" definition. However, using `graphql-tools-merge-typedefs`, these definitions can be merged as follows:
```js
const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const { mergeTypeDefs } = require('graphql-tools-merge-typedefs');
const customerSchema = require('./customer-schema');
const orderSchema = require('./order-schema');

// merge conflicting "Query", "Mutation", and "Subscription" definitions
const typeDefs = mergeTypeDefs([
  ...customerSchema.types,
  ...orderSchema.types
]);

const resolvers = [
  customerSchema.resolvers,
  orderSchema.resolvers
];

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => console.log(`Listening on port ${url}`));
```
