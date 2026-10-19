# samples

Writing samples from various jobs are available in [/writing-samples.md](/writing-samples.md).
# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

**Note**: feel free to use the package manager of your choice.

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

GitHub Actions builds and publishes the production site when changes are pushed to `main`. Pull request previews are published for same-repository pull requests from owners, members, and collaborators. Configure GitHub Pages to deploy from the `gh-pages` branch; see [.github/pages-setup.md](.github/pages-setup.md) for setup instructions.

For local development, use `npm run build` to generate the site in the `build` directory. Avoid running `npm run deploy` while the GitHub Actions workflows manage the `gh-pages` branch, because a manual deployment can replace the production site or PR previews.
