export class CreateUserDto {
  name: string;
  email: string;

  constructor(data: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
}
