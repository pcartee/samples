# GitHub Pages setup

The deployment workflows publish the production site and pull request previews to the `gh-pages` branch. Configure Pages to deploy from that branch:

1. In GitHub, open the repository settings.
2. Select **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set the branch to `gh-pages` and the folder to `/(root)`, then select **Save**.
5. Push to `main` or run the production deployment workflow from `main` to publish the site.

The production site is usually available at `https://<owner>.github.io/<repository>/`, unless the repository uses a user-site URL or custom domain.

Production deployments replace the site files while retaining the `pr-preview/` directory. Preview deployment is limited to same-repository pull requests opened by owners, members, or collaborators. Preview URLs use the repository's GitHub Pages base URL followed by `pr-preview/pr-<number>/`.

The first deployment creates the `gh-pages` branch. If GitHub Pages does not begin deploying after that run, confirm that the branch and root folder are selected in the Pages settings.
