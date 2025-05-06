import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: { id: number; role: string }) {
  return await new SignJWT({ id: payload.id, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<{ id: number; role: string }> {
  const { payload } = await jwtVerify(token, SECRET);
  return { id: payload.id as number, role: payload.role as string };
}