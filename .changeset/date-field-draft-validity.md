---
'@lar-works/design-system': minor
---

DateField reports its draft through `onDraftChange` (`DateFieldDraft`: text, parsed value, validity and a message once the reader leaves an invalid draft), so forms can hold submit and show the message as the Field's `errorText`. Enter on an invalid draft marks it invalid too.
