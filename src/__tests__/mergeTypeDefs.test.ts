import { mergeTypeDefs } from '../mergeTypeDefs';

test('query type defs are merged', () => {
  const queryDefs = [
    getTypeDef('Query', 'queryField1'), getTypeDef('Query', 'queryField2')
  ];

  const defs: any = mergeTypeDefs(queryDefs);

  expect(defs.length).toBe(1);
  expect(defs[0].kind).toBe('Document');
  expect(defs[0].definitions.length).toBe(1);
  expect(defs[0].definitions[0].name.value).toBe('Query');
  expect(defs[0].definitions[0].fields.length).toBe(2);
  expect(defs[0].definitions[0].fields[0].name.value).toBe('queryField1');
  expect(defs[0].definitions[0].fields[1].name.value).toBe('queryField2');
});

test('mutation type defs are merged', () => {
  const mutationDefs = [
    getTypeDef('Mutation', 'mutationField1'), getTypeDef('Mutation', 'mutationField2')
  ];

  const defs: any = mergeTypeDefs(mutationDefs);

  expect(defs.length).toBe(1);
  expect(defs[0].kind).toBe('Document');
  expect(defs[0].definitions.length).toBe(1);
  expect(defs[0].definitions[0].name.value).toBe('Mutation');
  expect(defs[0].definitions[0].fields.length).toBe(2);
  expect(defs[0].definitions[0].fields[0].name.value).toBe('mutationField1');
  expect(defs[0].definitions[0].fields[1].name.value).toBe('mutationField2');
});

test('subscription type defs are merged', () => {
  const subscriptionDefs = [
    getTypeDef('Subscription', 'subscriptionField1'),
    getTypeDef('Subscription', 'subscriptionField2')
  ];

  const defs: any = mergeTypeDefs(subscriptionDefs);

  expect(defs.length).toBe(1);
  expect(defs[0].kind).toBe('Document');
  expect(defs[0].definitions.length).toBe(1);
  expect(defs[0].definitions[0].name.value).toBe('Subscription');
  expect(defs[0].definitions[0].fields.length).toBe(2);
  expect(defs[0].definitions[0].fields[0].name.value).toBe('subscriptionField1');
  expect(defs[0].definitions[0].fields[1].name.value).toBe('subscriptionField2');
});

test('all type defs are merged', () => {
  const allDefs = [
    getTypeDef('Query', 'queryField1'),
    getTypeDef('Query', 'queryField2'),
    getTypeDef('Mutation', 'mutationField1'),
    getTypeDef('Mutation', 'mutationField2'),
    getTypeDef('Subscription', 'subscriptionField1'),
    getTypeDef('Subscription', 'subscriptionField2')
  ];

  const defs: any = mergeTypeDefs(allDefs);

  expect(defs.length).toBe(3);
  expect(defs[0].kind).toBe('Document');
  expect(defs[0].definitions.length).toBe(1);
  expect(defs[0].definitions[0].fields.length).toBe(2);
  expect(defs[0].definitions[0].fields[0].name.value).toBe('queryField1');
  expect(defs[0].definitions[0].fields[1].name.value).toBe('queryField2');
  expect(defs[1].definitions[0].fields[0].name.value).toBe('mutationField1');
  expect(defs[1].definitions[0].fields[1].name.value).toBe('mutationField2');
  expect(defs[2].definitions[0].fields[0].name.value).toBe('subscriptionField1');
  expect(defs[2].definitions[0].fields[1].name.value).toBe('subscriptionField2');
});

function getTypeDef(operationType: String, fieldName: String): Object {
  return {
    kind: 'Document',
    definitions: [
      {
        kind: 'ObjectTypeDefinition',
        name: {
          kind: 'Name',
          value: operationType
        },
        fields: [
          {
            kind: 'FieldDefinition',
            name: {
              kind: 'Name',
              value: fieldName
            }
          }
        ]
      }
    ]
  };
}
