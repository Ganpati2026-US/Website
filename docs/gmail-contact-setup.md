# Gmail contact delivery and automatic replies

The website is prepared to send new enquiries to `contact@appetiserindia.com` and
send an immediate branded acknowledgement to the visitor through Google Apps
Script. Gmail credentials are never stored in the website.

## One-time Google setup

1. Sign in to the Google account that owns the Apps Script. In Gmail, open
   **Settings → See all settings → Accounts and Import → Send mail as**, then
   add and verify `contact@appetiserindia.com` with **Treat as an alias** enabled.
2. Open [script.google.com](https://script.google.com/).
3. Create a **New project** named `Appetiser India enquiries`.
4. Replace the contents of `Code.gs` with
   `integrations/google-apps-script/Code.gs` from this repository.
5. Select **Deploy → New deployment → Web app**.
6. Set **Execute as** to `Me` and **Who has access** to `Anyone`.
7. Select **Deploy**, approve the Gmail permission, and copy the `/exec` URL.
8. Create `frontend/.env.production` containing:

   ```env
   REACT_APP_CONTACT_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

9. Rebuild and deploy the website.

Open the `/exec` URL directly before rebuilding. It should display JSON with
`"status":"ok"`. Submit one test enquiry with an email address you can check;
confirm both the company notification and visitor acknowledgement arrive.

## Updating the email script

After changing `Code.gs`, use **Deploy → Manage deployments → Edit**, select
**New version**, then deploy. Keeping the same deployment preserves the URL.

The script validates fields, ignores the honeypot, deduplicates request IDs and
limits each visitor email to five submissions per hour. Google applies its own
daily email quota. Every outgoing message uses `contact@appetiserindia.com` for
both **From** and **Reply-To**. The script checks that this address is a verified
Gmail sender alias and stops with an error if it is unavailable, so it cannot
silently send from the personal Gmail address.
