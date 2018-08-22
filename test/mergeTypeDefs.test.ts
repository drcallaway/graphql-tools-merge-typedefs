import gql from 'graphql-tag'
import { snapshot } from './utils';
import { mergeTypeDefs, merge } from '../src/mergeTypeDefs';


test.each([ 'Query', 'Mutation', 'Subscription' ])('%s type defs are merged', (type) => {
  const defs: any = mergeTypeDefs([
    gql`
      type ${type} {
        ${type.toLowerCase()}Field1: String
      }
    `,
    gql`
      type ${type} {
        ${type.toLowerCase()}Field2: String
      }
    `,
  ])

  snapshot(defs)
})


test('all type defs are merged', () => {
  const defs: any = mergeTypeDefs([
    gql`
      type Query {
        queryFieldSet1: String
      }
      type Mutation {
        mutationFieldSet1: String
      }
      type Subscription {
        subscriptionFieldSet1: String
      }
    `,
    gql`
      type Query {
        queryFieldSet2: String
      }
      type Mutation {
        mutationFieldSet2: String
      }
      type Subscription {
        subscriptionFieldSet2: String
      }
    `,
  ])

  snapshot(defs)
});

test('two fields in the same type', () => {
  const defs: any = mergeTypeDefs([
    gql`
      type Local {
        field1: String
        field2: String
      }
    `,
    gql`
      type Local {
        field1: Int
      }
    `,
  ], 'Local')

  snapshot(defs)
})


test('multiple types in a def', () => {
  const defs: any = mergeTypeDefs([
    gql`
      type Fun {
        woohoo: String
      }
      type User {
        id: String
      }
      type Local {
        field1: User
        field2: Fun
      }
    `,
    gql`
      type Local {
        field3: Int
      }
    `,
  ], 'Local')

  // make sure the type is removed from each def except the last one
  expect(defs.slice(0, -1).find((def) => def.definitions.find(({ name }) => name.value === 'Local'))).toBeFalsy()
  snapshot(defs)
})


test('filters out falsy values', () => {
  const defs: any = mergeTypeDefs([
    false,
    null,
    gql`
      type Something {
        field1: Int
      }
    `,
    gql`
      type Query {
        something: Something
      }
    `,
  ], 'Something')

  snapshot(defs)
})

test('handles multiple types', () => {
  const defs: any = mergeTypeDefs([
    gql`
      type Local {
        field1: Int
      }
      type Something {
        field1: Int
      }
    `,
    gql`
      type Local {
        field2: Int
      }
      type Something {
        field2: Int
      }
      type Query {
        something: Something
      }
    `,
  ], [ 'Something', 'Local' ])

  snapshot(defs)
})
