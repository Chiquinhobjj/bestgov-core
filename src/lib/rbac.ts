export type Role = 'ADMIN' | 'AGENT' | 'VIEWER';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface Rule { path: RegExp; method: Method | '*'; roles: Role[] }

export const RULES: Rule[] = [
  { path: /^\/api\/requests$/,           method: 'GET',   roles: ['ADMIN','AGENT','VIEWER'] },
  { path: /^\/api\/requests\/\d+$/,      method: 'POST',  roles: ['ADMIN','AGENT'] },
  { path: /^\/api\/requests\/\d+$/,      method: 'PATCH', roles: ['ADMIN','AGENT'] },
  { path: /^\/api\/requests$/,           method: 'POST',  roles: ['ADMIN','AGENT'] },

  { path: /^\/api\/users.*$/,            method: '*',     roles: ['ADMIN'] },
  { path: /^\/api\/audit.*$/,            method: 'GET',   roles: ['ADMIN','AGENT'] },
];

/** retorna true se o role puder acessar */
export function canAccess(path: string, method: Method, role: Role) {
  return RULES.some(r =>
    (r.method === method || r.method === '*') &&
    r.path.test(path) &&
    r.roles.includes(role)
  );
}