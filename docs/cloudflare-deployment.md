# Cloudflare deployment

The site is deployed as the `appetiserindia` Cloudflare Worker.

Use the repository root as the Cloudflare build root:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

The root `wrangler.jsonc` serves the `build` directory and enables
`assets.not_found_handling: "single-page-application"`. This lets React render
URLs such as `/products`, `/services`, `/about`, `/careers`, and `/contact` when
opened directly or refreshed. Keep this setting when updating deployment config.

Cloudflare configuration reference:
https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/

For a manual deployment from a machine authenticated with Cloudflare:

```sh
npm run build
npx wrangler login
npx wrangler deploy
```
