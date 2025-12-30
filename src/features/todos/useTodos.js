import { useEffect, useState } from 'react';
import { loadTodos, saveTodos } from './todosRepository';

function createTodo(text) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    createdAt: Date.now(),
    done: false,
    doneAt: null,
  };
}

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await loadTodos();
        if (!cancelled) setTodos(Array.isArray(stored) ? stored : []);
      } finally {
        if (!cancelled) setIsHydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isHydrating) return;
    saveTodos(todos);
  }, [todos, isHydrating]);

  const add = (text) => {
    const trimmed = String(text ?? '').trim();
    if (!trimmed) return;
    setTodos((current) => [createTodo(trimmed), ...current]);
  };

  const toggleDone = (id) => {
    setTodos((current) =>
      current.map((t) => {
        if (t.id !== id) return t;

        const nextDone = !Boolean(t.done);
        return {
          ...t,
          done: nextDone,
          doneAt: nextDone ? Date.now() : null,
        };
      })
    );
  };

  return { todos, add, toggleDone, isHydrating };
}
