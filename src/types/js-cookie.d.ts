declare module 'js-cookie' {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }

  interface CookieStatic {
    set(name: string, value: string, options?: CookieAttributes): string | undefined;
    get(name: string): string | undefined;
    remove(name: string, options?: CookieAttributes): void;
  }

  const Cookies: CookieStatic;
  export default Cookies;
}
