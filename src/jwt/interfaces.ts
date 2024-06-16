import { UserLoginType } from 'src/entities';

export interface IPayload {
  id: number;
  username: string;
  email: string;
  loginType: UserLoginType;
}
