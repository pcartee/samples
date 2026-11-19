# Contributing

## Documentation quality checks

Every change to the docs goes through automated checks for style, spelling, Markdown, and links. The same tools, versions, and rules run in three places, so if your change passes on your computer, it passes on the pull request.

| Where | When | What it checks |
|---|---|---|
| VS Code | As you type | Style, spelling, and Markdown on the whole file |
| Pre-commit hook | When you commit | Style, spelling, Markdown, and exception comments on the lines you staged |
| Pull request | On every push | All of the above on the lines you added or changed, plus internal and external links |

Only lines you add or change can fail a check. Existing issues elsewhere in a file don't block your work, though VS Code still shows them.

### Set up your computer

You need [Node.js](https://nodejs.org/) 20 or later and Git.

1. Clone the repository and open the folder in VS Code.
2. In the terminal, run:

   ```bash
   npm run setup
   ```

   This installs the dependencies and the pre-commit hook. It also downloads pinned, checksum-verified copies of Vale and lychee into `.tools/`.
3. When VS Code asks whether to install the recommended extensions, select **Install**. To install them later, open the Extensions view and search for `@recommended`.

Run `npm run setup` again whenever someone updates a tool version.

### What each check does

#### Style (Vale)

Vale checks your writing against the [Microsoft Writing Style Guide](https://learn.microsoft.com/style-guide/welcome/). It blocks errors and warnings. Suggestions appear in VS Code only and never block.

| Rule | What it means | How to fix it |
|---|---|---|
| `Microsoft.Passive` | The sentence uses passive voice. | Name who does the action. Change "The file is created by the installer" to "The installer creates the file." |
| `Docs.Headings` | A heading isn't in sentence case. | Capitalize only the first word and proper nouns. Change "Configure The Key Broker" to "Configure the key broker." |
| `Microsoft.Contractions` | The guide prefers contractions. | Change "do not" to "don't" and "it is" to "it's." |
| `Microsoft.HeadingAcronyms` | A heading has an acronym that readers might not know. | Spell out the term, or put the acronym in the body text instead. |
| `Microsoft.UIVerbs` | Input-specific verbs like "click." | Use "select." |
| `Microsoft.FirstPerson`, `Microsoft.We` | "I," "we," or "our." | Address the reader as "you." |

Each Vale message links to the relevant page of the style guide.

Vale skips front matter, code blocks, inline code, URLs, and MDX `import` and `export` lines.

#### Spelling (cspell)

cspell flags words that aren't in its English dictionary or in the [docs terms list](docs-review/docs-terms.txt). It skips front matter, code blocks, inline code, URLs, and JSX tags.

If the word is misspelled, fix it. If it's a correct product name, acronym, or technical term, [add it to the terms list](#add-a-term-to-the-terms-list).

#### Markdown (markdownlint)

| Rule | What it means | How to fix it |
|---|---|---|
| `MD029` | Ordered lists must count up: 1, 2, 3. "Lazy" numbering where every item is `1.` isn't allowed. | Renumber the list. If a code block or image splits a list, indent it under the step so the list continues. |
| `MD045` | An image has no alt text. | Describe the image: `![Settings page with the API keys tab selected](img/keys.png)`. |
| `DOCS001` | Alt text is blank (`![ ](x.png)` or `alt=""`). | Describe the image. For a decorative image, [request an exception](#request-a-rule-exception). |
| `MD009`, `MD047` | Trailing spaces, or no newline at the end of the file. | Delete the spaces, or add a final newline. |

The rule settings are in [.markdownlint.json](.markdownlint.json).

#### Links

| Check | What it checks | When |
|---|---|---|
| Internal links | Every page link, anchor (`#heading`), and image in the built site. Docusaurus fails the build on a broken link, then lychee rechecks the HTML offline. | Every pull request, across the whole site |
| External links | Web links in the files your pull request changes. It retries, waits up to 30 seconds, and reuses successful results for a day, so a brief outage doesn't block you. | Every pull request |
| Weekly scan | Every web link in the docs. Failures open a GitHub issue labeled `broken-links` instead of blocking anyone. | Mondays |

If an external link fails, open it in a browser. If it's broken, fix or remove it. If it works in a browser but the check can't reach it (for example, a site that blocks automated requests), [request a link exclusion](#exclude-a-link-from-checks).

### Add a term to the terms list

[docs-review/docs-terms.txt](docs-review/docs-terms.txt) is the only custom word list. cspell, Vale, and VS Code all read it, so don't add words anywhere else.

To add a term:

- In VS Code, select the underlined word, select **Quick Fix** (Ctrl+. or Cmd+.), and then select **Add: "word" to docs-terms**. Or:
- Open `docs-review/docs-terms.txt` and add the term on its own line, spelled and capitalized as it should appear. Lines that start with `#` are comments.

Add each form that appears in the docs, such as `TEE` and `TEEs`. Commit the change with your docs change.

### Request a rule exception

Sometimes a rule is wrong for a specific sentence, such as when you quote UI text that uses passive voice. In that case, you can turn off **one rule** for **one line or a short block**. You can't turn off all rules, a whole style, or a whole file.

Every exception needs:

- A `<!-- reason: ... -->` comment (10 or more characters) on the same line as the exception comment.
- Approval from a docs maintainer. The **Exception approval** check on your pull request stays red until a maintainer listed in [.github/docs-maintainers.txt](.github/docs-maintainers.txt) approves your latest commit.

The pre-commit hook and the pull request check reject exceptions that are too broad or have no reason.

#### Vale (one rule, a block of up to 20 lines)

```markdown
<!-- vale Microsoft.Passive = NO --><!-- reason: quotes the error message exactly as the product shows it -->
The error says "Your session was ended by the server."
<!-- vale Microsoft.Passive = YES -->
```

Not allowed: `<!-- vale off -->` and `<!-- vale Microsoft = NO -->`.

#### markdownlint (one rule, one line)

```markdown
<!-- markdownlint-disable-next-line DOCS001 --><!-- reason: decorative divider with no information -->
<img src="/img/divider.png" alt="" />
```

You can also put `<!-- markdownlint-disable-line MD045 --><!-- reason: ... -->` at the end of the line itself.

Not allowed: `markdownlint-disable` without `-line` or `-next-line`, `markdownlint-disable-file`, or more than one rule.

#### cspell (one line)

```markdown
<!-- cspell:disable-next-line --><!-- reason: misspelling quoted from a customer log -->
The log shows "conection refused."
```

Not allowed: `cspell:disable`, `cspell:ignore`, and `cspell:words`. If a word is correct, add it to the terms list instead.

#### Exclude a link from checks

Add a regular expression to [.lycheeignore](.lycheeignore), with a `# reason:` comment on the line above:

```text
# reason: vendor portal returns 403 to automated requests but works in a browser
^https://portal\.example\.com/
```

Make the pattern as narrow as you can. Changes to `.lycheeignore` need maintainer approval.

### Run the checks yourself

| Command | What it does |
|---|---|
| `npm run lint:docs` | Style, spelling, Markdown, and exception checks on lines changed since `origin/main` (same as the pull request check) |
| `npm run check:links` | Builds the site and checks all internal links and anchors |
| `npm run check:links:external` | Checks web links in files changed since `origin/main` |
| `npm run lint:docs:all` | Every check on every line of every doc. Use it to plan cleanup, not as a gate. |

Run `git fetch origin` first so `origin/main` is current.

### Troubleshooting

- **"Vale isn't installed" or "lychee isn't installed."** Run `npm run setup`.
- **The commit was rejected.** Read the messages above the summary. Each one shows the file, line, rule, and how to fix it. Fix the issues, then stage and commit again. Use `git commit --no-verify` only in an emergency; the pull request check still runs.
- **VS Code shows issues the check didn't report.** VS Code checks the whole file, and the commit and pull request checks look only at lines you changed. VS Code also shows Vale suggestions, which never block.
- **The VS Code Vale extension can't find Vale on Windows.** In your user settings, set `vale.valeCLI.path` to `${workspaceFolder}\.tools\bin\vale.exe`.
