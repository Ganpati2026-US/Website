# Gmail contact delivery and automatic replies

The website is prepared to send new enquiries to `contact@appetiserindia.com` and
send an immediate branded acknowledgement to the visitor through Google Apps
Script. Gmail credentials are never stored in the website.

## One-time Google setup

1. Sign in as `contact@appetiserindia.com`.
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
daily email quota. Because this project runs as the contact mailbox, every
outgoing message is sent directly from and replies to
`contact@appetiserindia.com`; no sender alias is required.

## Separate recruitment deployment

Recruitment uses its own Apps Script project and Google Workspace account:

1. Sign in as `recruiter@appetiserindia.com`.
2. Create a new Apps Script project named `Appetiser India recruitment`.
3. Paste `integrations/google-apps-script/recruitment/Code.gs` into its `Code.gs`.
4. Deploy it as a web app with **Execute as: Me** and **Who has access: Anyone**.
5. Copy its `/exec` URL into `site.careersEndpoint` in
   `frontend/src/config/site.ts`.

Because this project runs as the recruitment mailbox, its messages are sent
directly from and reply to `recruiter@appetiserindia.com`; no cross-account
sender alias is needed. Candidate details and their secure Google Drive or
iCloud résumé link are delivered to that mailbox. Ensure shared documents allow
viewing by anyone with the link.
