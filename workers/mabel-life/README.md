# Mabel Life Worker

This is the source for the existing `mabel-life` Cloudflare Worker.

## Bindings and triggers

Keep the current Workers AI binding named `AI` and KV namespace binding named `MABEL_STATE`. Keep the existing Cron Trigger if you want Mabel’s scheduled life updates and nightly personality reflection. The reflection checks once per UTC date after 20:00 UTC, and only adds a trait when separate saved memories or reflections support it.

## Deploy

Paste `index.js` into the existing `mabel-life` Worker in Cloudflare, preserving its `AI` and `MABEL_STATE` bindings and its current Cron Trigger.

The existing routes continue to work. A new public `GET /mabel-brain` route returns only the shared mood, thought, needs, and personality traits for the website’s Brain panel. The broader `GET /mabel-state` route remains available for existing integrations.
