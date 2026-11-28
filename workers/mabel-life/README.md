# Mabel Life Worker

This folder contains the Cloudflare Worker source for `mabel-life`.

## Cloudflare bindings

Keep the Workers AI binding named `AI` and the legacy KV namespace binding named `MABEL_STATE`. Add a D1 binding named `VISITOR_BOARD_DB` that points to the `mabel-noticeboard` database. It serves both the visitor noticeboard and Mabel’s shared key/value records. The Worker reads legacy values from KV once and copies them to D1 when first accessed, then sends new writes to D1 so the daily KV write ceiling cannot freeze her shared life.

The website calls `/mabel-brain` for shared life, interests, Library notes, wishes, and Bindle state. It calls `/mabel-day` when a visitor opens the site; the Worker limits ordinary witnessed life updates to one per UTC day, while a newly supplied book can request one prompt reading cycle.

The D1 database needs the schemas in `migrations/0001_visitor_board.sql` and `migrations/0002_shared_state.sql`. They have already been applied to the account’s `mabel-noticeboard` database. For a fresh database, apply both SQL files from Cloudflare’s D1 console before deploying this Worker.

## Visitor privacy and shared state

Mabel’s interests, personality, mood, Library learning, activity history, baking pantry, shared Bindle, and private mailbox records are stored in D1. Visitor gifts are labelled with an anonymous number. The Worker does not put visitor names, browser IDs, or chat transcripts into Mabel’s shared record.

Wander discoveries stay in Mabel’s exploration and activity records. They do not generate Postbox notes. The site keeps the separate “Mabel noticed your gift” alert, but sends a personal Postbox note about a visitor gift only if Mabel later chooses that gift as a special treasure.

Book supplier IDs are kept in separate per-book records in D1. A short thought from Mabel’s reading is added to shared knowledge and sent to the supplying browser’s private mailbox using `/mailbox?visitorId=…`. That route requires the unguessable browser ID and returns only that mailbox’s notes. Conversations remain on the visitor’s browser; they are not published in the Library or shared activity log.

The shared Bindle keeps active gifts and a small history. Recognized baking ingredients enter the pantry; ingredients are moved to Bindle history when used. `bakingIngredientType()` is deliberately a conservative ingredient list, so ordinary objects such as loose nuts and bolts must never enter the pantry. The site’s wider edible-name check can classify a visitor’s free-text gift before sending it to the Worker.

## Reading and autonomous life

The first few pages of a newly supplied book are eligible for Mabel’s next prompted Life cycle, including outside the evening window. Later reading sessions remain limited to a short passage per UTC evening. Mabel’s short original note becomes shared knowledge; a private copy goes only to the visitor who supplied the book.

Baking uses recognized pantry ingredients, requires adequate food, water, and rest, and observes a two-hour cooldown. Practices, crafts, coding sketches, and needs updates are bounded by the current Worker logic. There is no background timer in this source: an ordinary Life cycle runs when the site requests `/mabel-day`.

## Daily Ko-fi pick

Visitors with a bond of at least 35 can nominate any drawing from Mabel’s Gallery. They can vote for a daily exhibition drawing once each. The “leading Ko-fi pick” is the most-voted work in today’s exhibition.

The Daily Art Exhibition includes an owner-only panel. Set the Worker secret `MABEL_ADMIN_PASSWORD` under Cloudflare → Workers & Pages → `mabel-life` → Settings → Variables and Secrets. Use a long, unique passphrase and keep it out of the public repository. Enter that passphrase in the exhibition panel to see the leading drawing, copy its caption, and download a PNG for manual upload to Ko-fi. The visitor-facing exhibition stays public; the owner-only endpoint returns the pick only after the passphrase is checked.

## Deploy

Deploy the full `index.js` contents to the existing `mabel-life` Worker. Keep the `AI` and `MABEL_STATE` bindings and add the `VISITOR_BOARD_DB` D1 binding described above. Add the `MABEL_ADMIN_PASSWORD` secret before using the private Ko-fi panel. The website changes in `index.html`, `script.js`, and `style.css` are deployed separately through the repository’s Pages workflow.

Some coding projects use MabelScript, a small allow-listed drawing instruction format. The site interprets only bounded circles, rectangles, lines, and text on a canvas. It does not evaluate generated JavaScript or Python.
