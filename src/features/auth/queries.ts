// Replace the upstream src/features/auth/queries.ts with this file when using Django.
'use server';

import { cookies } from 'next/headers';

const API_BASE = process.env.DJANGO_API_BASE_URL ?? 'http://127.0.0.1:8000';

export const getCurrent = async () => {
  try {
    const session = cookies().get('sessionid');
    if (!session?.value) return null;
    const response = await fetch(`${API_BASE}/api/auth/current`, {
      headers: { Cookie: `sessionid=${session.value}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const body = await response.json();
    return body.data ?? null;
  } catch {
    return null;
  }
};
