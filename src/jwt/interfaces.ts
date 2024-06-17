import { UserLoginType } from 'src/entities';

export interface IPayload {
  id: number;
  nickname: string;
  email: string;
  loginType: UserLoginType;
}
