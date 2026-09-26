# Gmail contact delivery and automatic replies

The website is prepared to send new enquiries to `appetiserindia@gmail.com` and
send an immediate branded acknowledgement to the visitor through Google Apps
Script. Gmail credentials are never stored in the website.

## One-time Google setup

1. Sign in to `appetiserindia@gmail.com` and open
   [script.google.com](https://script.google.com/).
2. Create a **New project** named `Appetiser India enquiries`.
3. Replace the contents of `Code.gs` with
   `integrations/google-apps-script/Code.gs` from this repository.
4. Select **Deploy → New deployment → Web app**.
5. Set **Execute as** to `Me` and **Who has access** to `Anyone`.
6. Select **Deploy**, approve the mail permission, and copy the `/exec` URL.
7. Create `frontend/.env.production` containing:

   ```env
   REACT_APP_CONTACT_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

8. Rebuild and deploy the website.

Open the `/exec` URL directly before rebuilding. It should display JSON with
`"status":"ok"`. Submit one test enquiry with an email address you can check;
confirm both the company notification and visitor acknowledgement arrive.

## Updating the email script

After changing `Code.gs`, use **Deploy → Manage deployments → Edit**, select
**New version**, then deploy. Keeping the same deployment preserves the URL.

The script validates fields, ignores the honeypot, deduplicates request IDs and
limits each visitor email to five submissions per hour. Google applies its own
daily email quota. Messages display `Appetiser India` as the sender name, while
the actual sending address remains `appetiserindia@gmail.com` until a company
domain and Google Workspace account are configured.
