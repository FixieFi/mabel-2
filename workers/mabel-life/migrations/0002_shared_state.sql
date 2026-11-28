CREATE TABLE IF NOT EXISTS mabel_kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mabel_kv_updated_at
  ON mabel_kv(updated_at);
