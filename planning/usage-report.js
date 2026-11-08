// Usage report. Run in codemode (ultimate.* is injected). Set ROOT to the coordinator's conversation id.
const ROOT = 3116;
const convs = await ultimate.conversations();
const pid = c => c.owner?.conversationId ?? c.parent?.conversationId;
const ids = [ROOT];
for (let i = 0; i < ids.length; i++) for (const c of convs) if (pid(c) === ids[i] && !ids.includes(c.id)) ids.push(c.id);
const at = new Date().toISOString();
const rows = [], missing = [], tot = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0 };
for (const id of ids) {
  let u; try { u = await ultimate.doc('pi.usage', id); } catch { missing.push(id); continue; }
  const r = { id, label: convs.find(c => c.id === id)?.label, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0 };
  for (const m of Object.values(u.models || {})) { r.input += m.input; r.output += m.output; r.cacheRead += m.cacheRead; r.cacheWrite += m.cacheWrite; r.cost += m.cost.total; }
  for (const k of Object.keys(tot)) tot[k] += r[k];
  rows.push(r);
}
return { at, ids, rows, tot, partial: missing.length > 0, missing };
