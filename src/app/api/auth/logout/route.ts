@tailwind base;
@tailwind components;
@tailwind utilities;

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
  return NextResponse.json({ ok: true });
}