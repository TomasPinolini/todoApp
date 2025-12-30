import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

function buildUrl(path) {
  const base = SUPABASE_URL.replace(/\/$/, '');
  const cleanPath = String(path).replace(/^\//, '');
  return `${base}/${cleanPath}`;
}

async function supabaseFetch(path, { method = 'GET', headers, body } = {}) {
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body == null ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const error = new Error(`Supabase request failed: ${res.status} ${res.statusText}`);
    error.status = res.status;
    error.details = text;
    throw error;
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }

  return await res.text();
}

const TODOS_TABLE = 'todos';

export async function fetchTodos() {
  const rows = await supabaseFetch(
    `rest/v1/${TODOS_TABLE}?select=id,text,done,created_at,updated_at,done_at&order=created_at.desc`,
    { method: 'GET' }
  );

  return Array.isArray(rows) ? rows : [];
}

export async function upsertTodos(todos) {
  await supabaseFetch(`rest/v1/${TODOS_TABLE}?on_conflict=id`, {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: todos,
  });
}

export async function deleteTodosByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return;

  const encoded = ids.map((id) => `"${String(id).replace(/"/g, '\\"')}"`).join(',');
  await supabaseFetch(`rest/v1/${TODOS_TABLE}?id=in.(${encoded})`, {
    method: 'DELETE',
    headers: {
      Prefer: 'return=minimal',
    },
  });
}
