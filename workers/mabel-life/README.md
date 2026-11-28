# Mabel Life Worker

This folder contains the Cloudflare Worker source for `mabel-life`.

## Cloudflare bindings

Keep the Workers AI binding named `AI` and the KV namespace binding named `MABEL_STATE`. The website calls `/mabel-brain` for shared life, interests, Library notes, wishes, and Bindle state. It calls `/mabel-day` when a visitor opens the site; the Worker limits ordinary witnessed life updates to one per UTC day, while a newly supplied book can request one prompt reading cycle.

## Visitor privacy and shared state

Mabel’s interests, personality, mood, Library learning, activity history, baking pantry, and shared Bindle are stored in the shared `MABEL_STATE` record. Visitor gifts are labelled with an anonymous number. The Worker does not put visitor names, browser IDs, or chat transcripts into that shared record.

Wander discoveries stay in Mabel’s exploration and activity records. They do not generate Postbox notes. The site keeps the separate “Mabel noticed your gift” alert, but sends a personal Postbox note about a visitor gift only if Mabel later chooses that gift as a special treasure.

Book supplier IDs are kept in separate per-book KV records. A short thought from Mabel’s reading is added to shared knowledge and sent to the supplying browser’s private mailbox using `/mailbox?visitorId=…`. That route requires the unguessable browser ID and returns only that mailbox’s notes. Conversations remain on the visitor’s browser; they are not published in the Library or shared activity log.

The shared Bindle keeps active gifts and a small history. Recognized baking ingredients enter the pantry; ingredients are moved to Bindle history when used. `bakingIngredientType()` is deliberately a conservative ingredient list, so ordinary objects such as loose nuts and bolts must never enter the pantry. The site’s wider edible-name check can classify a visitor’s free-text gift before sending it to the Worker.

## Reading and autonomous life

The first few pages of a newly supplied book are eligible for Mabel’s next prompted Life cycle, including outside the evening window. Later reading sessions remain limited to a short passage per UTC evening. Mabel’s short original note becomes shared knowledge; a private copy goes only to the visitor who supplied the book.

Baking uses recognized pantry ingredients, requires adequate food, water, and rest, and observes a two-hour cooldown. Practices, crafts, coding sketches, and needs updates are bounded by the current Worker logic. There is no background timer in this source: an ordinary Life cycle runs when the site requests `/mabel-day`.

## Deploy

Deploy the full `index.js` contents to the existing `mabel-life` Worker. Preserve the `AI` and `MABEL_STATE` bindings. The website changes in `script.js` are deployed separately through the repository’s Pages workflow.

Some coding projects use MabelScript, a small allow-listed drawing instruction format. The site interprets only bounded circles, rectangles, lines, and text on a canvas. It does not evaluate generated JavaScript or Python.
