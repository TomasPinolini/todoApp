import { getJson, setJson } from '../../shared/storage/kv';
import { fetchTodos, upsertTodos } from '../../shared/supabase/rest';

const TODOS_KEY = 'todos:v1';

function normalizeFromRemote(row) {
  return {
    id: row.id,
    text: row.text,
    done: Boolean(row.done),
    createdAt: typeof row.created_at === 'number' ? row.created_at : row.createdAt,
    doneAt: typeof row.done_at === 'number' ? row.done_at : row.doneAt ?? null,
  };
}

export async function loadTodos() {
  try {
    const remote = await fetchTodos();
    const normalized = Array.isArray(remote) ? remote.map(normalizeFromRemote) : [];
    await setJson(TODOS_KEY, normalized);
    return normalized;
  } catch {
    return await getJson(TODOS_KEY, []);
  }
}

export async function saveTodos(todos) {
  const normalized = Array.isArray(todos) ? todos : [];
  await setJson(TODOS_KEY, normalized);

  try {
    await upsertTodos(
      normalized.map((t) => ({
        id: t.id,
        text: t.text,
        done: Boolean(t.done),
        created_at: typeof t.createdAt === 'number' ? t.createdAt : t.created_at,
        done_at: typeof t.doneAt === 'number' ? t.doneAt : t.done_at ?? null,
        updated_at: Date.now(),
      }))
    );
  } catch {
    // offline or backend unavailable; keep local cache and retry later via future sync mechanism
  }
}
