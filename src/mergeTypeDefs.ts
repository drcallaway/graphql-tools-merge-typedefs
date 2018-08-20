import { ITypeDefinitions } from 'graphql-tools';

/**
 * Merges all definitions of the given operation type.
 *
 * @param defs Type definitions to merge
 * @param type Operation type to merge
 */
function merge(defs: ITypeDefinitions, type: String): ITypeDefinitions {
  let operations = [];

  defs = (defs as any).filter(def => {
    const definitions = def.definitions.filter(definition => {
      const name = definition.name;
      if (definition.kind === 'ObjectTypeDefinition' && name.kind === 'Name' && name.value === type) {
        operations.push(definition);
        return false;
      }

      return true;
    });

    if (definitions.length === 0) {
      return false; // operation was the only definition so this can be removed
    }

    return true;
  });

  if (operations.length > 0) {
    if (operations.length > 1) {
      operations = operations.reduce((acc, query) => {
        if (acc === undefined) {
          acc = query;
        } else {
          acc.fields = acc.fields.concat(query.fields);
        }

        return acc;
      });
    }

    (defs as any).push({
      kind: "Document",
      definitions: [operations]
    });
  }

  return defs;
}

/**
 * Merges all query, mutation, and subscription type definitions.
 *
 * @param defs Type definitions to merge
 */
function mergeTypeDefs(defs): ITypeDefinitions {
  defs = merge(defs, 'Query');
  defs = merge(defs, 'Mutation');
  defs = merge(defs, 'Subscription');

  return defs;
}

export { mergeTypeDefs, merge };
