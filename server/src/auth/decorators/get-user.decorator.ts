import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('No user found (request): user');

    if (data) {
      switch (data) {
        case 'email':
          const email = user[data];
          if (!email) throw new Error(`No field found (request): ${data}`);
          return email;

        case 'id':
          const id = user[data];
          if (!id) throw new Error(`No field found (request): ${data}`);
          return id;

        default:
          throw new Error(
            `Unknown parameter (request): ${data}. Allowed parameters: ["email", "id"] `,
          );
      }
    }

    return user;
  },
);
