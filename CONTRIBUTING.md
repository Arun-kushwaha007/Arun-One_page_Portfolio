# Contributing Guide

## Primary Author

Arun Kushwaha is the primary author, owner, and final maintainer of this repository. External contributions are welcome, but major product, design, and content direction stays with the primary author.

## Before You Open an Issue

Please do these checks first:

1. Read the root `README.md` so you understand the project structure and setup.
2. Confirm the issue is reproducible on the latest code in this repository.
3. Check whether the problem is already documented in an existing issue or pull request.
4. Collect clear evidence: screenshots, console errors, failing commands, or exact reproduction steps.

## How to Open a Good Issue

When opening an issue, include:

- a short and specific title
- what you expected to happen
- what actually happened
- exact steps to reproduce
- device or environment details when relevant
- screenshots or logs if the issue is visual or runtime-related

Good issue examples:

- `Chatbot modal does not close on Escape after reopening`
- `Project cards overflow on small screens below 360px`
- `Voice fallback fails when local chatbot audio is missing`

Weak issue examples:

- `site broken`
- `please fix this`
- `ui issue`

## Before You Work on a Fix

If you want to solve an issue, follow this order:

1. Open or reference an issue first. Do not start with an untracked change.
2. Wait until the issue scope is clear enough to avoid duplicated work.
3. Keep the fix focused. Do not combine unrelated refactors with the issue fix.
4. Match the existing project style and architecture instead of rewriting large sections unnecessarily.

## Local Setup

```bash
cd Frontend
npm install
npm run dev
```

Useful validation commands:

```bash
cd Frontend
npm run build
npm run lint
node src/components/chatbot/data/chatbotKnowledge.test.js
node src/components/chatbot/data/chatbotVoice.test.js
```

## Contribution Rules

- Keep changes scoped to the issue you are solving.
- Do not rewrite portfolio content or author branding unless the issue requires it.
- Do not remove assets, UI behaviors, or interaction patterns without explaining why.
- Prefer improving existing patterns over introducing a second pattern for the same problem.
- If a change affects visuals, include before/after screenshots or a short video.
- If a change affects behavior, explain how you verified it.

## Pull Request Expectations

Every pull request should include:

- the issue number it addresses
- a short summary of the change
- the exact files or areas affected
- validation steps you ran
- screenshots for UI changes
- notes about any limitations or follow-up work

Suggested PR format:

```text
Summary:
Short explanation of the fix.

Issue:
Closes #<issue-number>

Validation:
- npm run build
- npm run lint
- node src/components/chatbot/data/chatbotKnowledge.test.js
```

## What May Be Rejected

The primary author may decline contributions that:

- change the visual identity without a strong reason
- add unnecessary dependencies
- mix multiple unrelated fixes into one PR
- reduce maintainability or readability
- do not include clear verification
- conflict with the intended direction of the portfolio

## Final Note

If you want to help, start with a clear issue and a narrow fix. That keeps review fast and makes it easier to merge useful work without disrupting the project direction.
