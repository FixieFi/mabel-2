CREATE TABLE IF NOT EXISTS visitor_board_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  visitor_number TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS visitor_board_messages_created_at
  ON visitor_board_messages (created_at DESC);
