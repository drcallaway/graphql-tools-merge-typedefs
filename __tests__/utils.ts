// this file contains any testing utils
import { print } from 'graphql/language/printer';


export function snapshot (obj: Object) {
  expect(print(obj).join('\n')).toMatchSnapshot();
}
