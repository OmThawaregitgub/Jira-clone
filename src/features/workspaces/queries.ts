// Replace the upstream src/features/workspaces/queries.ts with this file when using Django.
'use server';

import { cookies } from 'next/headers';

const API_BASE = process.env.DJANGO_API_BASE_URL ?? 'http://127.0.0.1:8000';

export const getWorkspaces = async () => {
  try {
    const session = cookies().get('sessionid');
    if (!session?.value) return { documents: [], total: 0 };
    const response = await fetch(`${API_BASE}/api/workspaces`, {
      headers: { Cookie: `sessionid=${session.value}` },
      cache: 'no-store',
    });
    if (!response.ok) return { documents: [], total: 0 };
    const body = await response.json();
    return body.data ?? { documents: [], total: 0 };
  } catch {
    return { documents: [], total: 0 };
  }
};
