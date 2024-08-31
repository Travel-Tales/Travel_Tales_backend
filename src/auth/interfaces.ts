type SameSiteOption = 'strict' | 'lax' | 'none';

export interface ICookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: SameSiteOption;
  domain: string;
  maxAge: number;
}
