# Mabel Life Worker

This is the source for the existing `mabel-life` Cloudflare Worker.

## Bindings and triggers

Keep the current Workers AI binding named `AI` and KV namespace binding named `MABEL_STATE`. Keep the existing Cron Trigger if you want Mabel’s scheduled life updates and nightly personality reflection. The reflection checks once per UTC date after 20:00 UTC, and only adds a trait when separate saved memories or reflections support it.

## Deploy

Paste `index.js` into the existing `mabel-life` Worker in Cloudflare, preserving its `AI` and `MABEL_STATE` bindings and its current Cron Trigger.

The existing routes continue to work. `GET /mabel-brain` now also returns Mabel’s wishes, reading shelf, practice objects, and shared hobbies so the site can show one Inner Life view. The broader `GET /mabel-state` route remains available for existing integrations.

The Library accepts text-based PDFs of up to 500 pages and 800,000 extracted characters. It stores extracted text under a separate KV key and keeps only book details, reading progress, and short notes in the main state record. The shelf allows eight unfinished books and retains up to 32 book records. The scheduled Life Worker reads one short passage per UTC evening after 18:00, so preserve a working Cron Trigger for gradual reading and autonomous practice. Scanned PDFs without selectable text are not OCR’d.

When Mabel notices a bicycle, instrument, sewing tool, drawing tool, or coding device, the site sends only its name to the shared Worker. Mabel can choose to practise with it later; the item isn’t copied into another visitor’s browser bindle. Baking uses pantry ingredients and keeps the existing two-hour cooldown.

Some coding projects use MabelScript, a small allow-listed drawing instruction format. The site interprets only bounded circles, rectangles, lines, and text on a canvas. It does not evaluate generated JavaScript or Python.

