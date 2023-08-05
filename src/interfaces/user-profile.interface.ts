export interface UserProfile {
  user: User;
  token: Token;
}

export interface User {
  id: number;
  address: string;
}

export interface Token {
  accessToken: string;
}
