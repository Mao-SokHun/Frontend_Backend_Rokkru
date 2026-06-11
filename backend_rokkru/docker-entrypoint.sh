#!/bin/sh
set -e

node app.js &
APP_PID=$!

seed_user_types() {
  node <<'NODE'
const names = ['Student', 'Teacher', 'Admin'];
const base = 'http://127.0.0.1:3000/api/v1/user-types';

async function main() {
  let types = [];
  try {
    const res = await fetch(base);
    if (!res.ok) return;
    types = await res.json();
  } catch {
    return;
  }
  if (!Array.isArray(types)) types = [];

  for (const name of names) {
    const exists = types.some(
      (t) => String(t.user_type_name || '').toLowerCase() === name.toLowerCase(),
    );
    if (exists) continue;
    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_type_name: name }),
      });
      if (res.ok) {
        const created = await res.json();
        types.push(created);
      }
    } catch {
      /* ignore */
    }
  }
}

main();
NODE
}

for i in $(seq 1 90); do
  if node -e "fetch('http://127.0.0.1:3000/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    seed_user_types
    wait $APP_PID
    exit $?
  fi
  sleep 1
done

echo "Backend failed to become healthy"
kill "$APP_PID" 2>/dev/null || true
exit 1
