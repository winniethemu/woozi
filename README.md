# Boardgame

## Local Setup

To set things up, have two terminal tabs open for `client/` and `server/`. Run

```
pnpm install
npm run dev
```

`pnpm install` installs external dependencies based on `package.json` and
outputs a `pnpm-lock.yaml` file.

`npm run dev` starts up the dev server. The actual commands run are specified
in `package.json`.

## Install New Package

We prefer **pnpm** over npm to preserve disk space. To add a new package, run

```
pnpm add -E ${PACKAGE_NAME}
pnpm add -D -E ${PACKAGE_NAME}
```

We prefer `-E` so everyone is using the exact same set of packages (i.e. no
minor version difference). This would be reflected in `pnpm-lock.yaml`.

When adding dev-only packages, use `-D` as well. (e.g. Type definition packages
like `@types/react`)

In summary, use npm only to start up local server with `npm run dev`.

