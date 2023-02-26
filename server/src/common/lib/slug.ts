export class SlugParser {
  parse(str: string) {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '_') // collapse whitespace and replace by _
      .replace(/-+/g, '_'); // collapse dashes
  }
}
