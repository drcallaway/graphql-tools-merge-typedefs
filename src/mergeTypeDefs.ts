import { ITypeDefinitions } from 'graphql-tools';

/**
 * Merges all definitions of the given operation type.
 *
 * @param defs Type definitions to merge
 * @param type Operation type to merge
 */
function merge(defs: ITypeDefinitions, type: String): ITypeDefinitions {
  let result;

  defs = (defs as any).filter(def => {
    // filter out falsy values just incase
    if (!def) return false;

    // reset def.definitions to be the filtered version so the `type` that
    // was passed in doesn't exist in it anymore
    def.definitions = def.definitions.filter(definition => {
      const { kind, name, fields } = definition;
      if (kind === 'ObjectTypeDefinition' && name.kind === 'Name' && name.value === type) {
        if (!result) {
          result = definition;
        } else {
          result.fields = result.fields.concat(fields);
        }

        // remove the definition because it's been added to the result and
        // shouldn't exist here anymore
        return false;
      }

      return true;
    });

    if (def.definitions.length === 0) {
      return false; // operation was the only definition so this can be removed
    }

    return true;
  });

  // update to be `result?.fields?.length` when it's available
  if (((result || {}).fields || []).length) {
    if (result.fields.length > 1) {
      // filters out duplicate keys. The last key always wins
      result.fields = result.fields.filter((field, i, array) => {
        return !array.slice(i + 1).find((obj) => obj.name.value === field.name.value);
      });
    }

    (defs as any).push({
      kind: "Document",
      definitions: [result]
    });
  }

  return defs;
}

/**
 * Merges all query, mutation, and subscription type definitions.
 *
 * @param defs Type definitions to merge
 * @param types any additonal types you want to target
 */
function mergeTypeDefs(defs, types = []): ITypeDefinitions {
  // handles strings and arrays of strings
  // also always includes these base 3
  types = [ 'Query', 'Mutation', 'Subscription'].concat(types);
  return types.reduce((prev, next) => merge(prev, next), defs);
}

// export default as well so people can rename it to be what ever they want
export default mergeTypeDefs;
export { mergeTypeDefs, merge };
