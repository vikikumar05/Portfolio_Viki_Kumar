export async function api(path, options) {
  try {
    const res = await fetch('/api' + path, { headers: { 'Content-Type': 'application/json' }, ...options });
    const json = await res.json().catch(() => null);
    return json || { success: false, message: 'Unexpected server response.' };
  } catch { return { success: false, message: 'Cannot reach the server. Is the backend running?' }; }
}
