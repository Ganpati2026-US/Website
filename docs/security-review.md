# Security review

The static Cloudflare site uses public Google Apps Script endpoints for contact
and recruitment. The Python API is a separate deployment and its protections do
not apply to Apps Script.

## Changes prepared

- Cloudflare static asset headers reject framing, disable object embeds, restrict
  base URLs, prevent MIME sniffing, and disable camera/microphone/location access.
- Both active Apps Script handlers reject missing, oversized and non-object JSON
  submissions. Additional field limits reject oversized email/contact details
  and line breaks in fields used in mail subjects.
- Environment files and credentials are already excluded from Git.

These changes take effect after rebuilding/deploying the site and publishing new
versions of both Apps Script deployments. They have not been deployed by this review.

## Priority follow-up

1. Add Cloudflare Turnstile to both forms and verify each token in the receiving
   Apps Script handler before sending mail. Keep the verification secret in Script
   Properties. Verification only in a frontend or proxy can be bypassed while the
   Apps Script endpoint remains public.
2. Replace best-effort cache counters with durable, atomic abuse controls. Current
   per-email limits can be bypassed by rotating addresses, cache entries can expire
   early, and concurrent requests can race. Add an overall sending budget and
   monitoring for quota exhaustion. Serialize duplicate checks and delivery state
   to prevent duplicate notifications from simultaneous requests or partial failure.
3. Enforce an allowlist for script, connection and image origins through a full
   Content Security Policy after testing the Spline/model viewer and Google endpoint
   redirects. The current policy covers framing, embeds and base URLs; it does not
   provide full script injection protection.
4. Enable MFA for GitHub, Cloudflare and both Workspace mailboxes; use minimal
   deployment permissions and keep secrets out of REACT_APP_* variables, which are
   embedded in the browser bundle.
5. Review dependency advisories and enable automated dependency updates. This review
   did not perform a complete dependency audit or a penetration test.
6. Minimize candidate data (consider removing date of birth), define mailbox
   retention and access rules, and treat submitted résumé links as untrusted.

References:
- https://developers.cloudflare.com/workers/static-assets/headers/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
