export class ResponseParser {
  createdSuccessfully(object: any, name: string) {
    return {
      message: `${name} created successfully`,
      object,
    };
  }

  successQuery(objects: any[] | any, count = null, name: string) {
    if (count) {
      return {
        message: `${name} query performed correctly`,
        count,
        objects,
      };
    }

    return {
      message: `${name} query performed correctly`,
      object: objects,
    };
  }

  deletedSuccessfully(name: string, id: string) {
    return {
      message: `${name} deleted successfully`,
      id,
    };
  }

  updatedSuccessfully(name: string, object: any, id: string) {
    return {
      message: `${name} updated successfully`,
      id,
      updateProduct: object,
    };
  }
}
