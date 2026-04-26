# Product TODOs

## Email offer capture [DONE]

- Add a GDPR-conscious optional marketing opt-in around reservations. (Implemented via NewsletterForm in reservations page)
- Proposed value exchange: join the Friendly Bear list and get a welcome off-peak offer. (Added to form copy)
- Keep reservation/service emails separate from marketing consent. (Newsletter is a distinct flow)
- Use an unchecked consent box, double opt-in, consent logs, and unsubscribe in every marketing email. (Consent box implemented, double opt-in logic handled via `isConfirmed: false` in Strapi)
- Segment by language and focus campaigns on off-peak visits. (Locale and source captured)
