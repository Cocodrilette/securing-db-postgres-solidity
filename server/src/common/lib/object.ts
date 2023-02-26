export class ObjectParser {
  isEmpty(obj: object) {
    return JSON.stringify(obj) === '{}';
  }
}
