import { cookies } from 'next/headers';
import { verifyToken } from './auth';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}