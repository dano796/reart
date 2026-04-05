# Contributing to ReArt

Thank you for considering contributing to ReArt! Contributions that improve the quality and reliability of this library are always welcome.

To ensure a smooth collaboration, please read the following guidelines before getting started.

## Issue Tracker

Use the GitHub issue tracker to report bugs, request enhancements, or start discussions. Before opening a new issue, check if one already exists. If not, feel free to create it with as much context as possible.

## Branch Naming

Please follow this naming convention when creating branches:

`feat/<feature-name>`

`fix/<component-name>`

For example: `fix/wave-ether-resize` or `feat/improve-noise-utils`.

## Pull Requests

To submit a pull request:

1. Fork the repository and create a new branch following the naming convention above.
2. Make your changes in the new branch.
3. Submit a pull request targeting the `main` branch.
4. Include a clear title, a description of your changes, and screenshots or recordings where applicable.

Before opening a pull request, make sure:

- Your changes are tested locally via the test app (`cd test-app && npm run dev`).
- The component renders correctly on both desktop and mobile.
- There are no errors in the browser console.
- If modifying a component, changes are reflected across all three layers: **engine**, **component**, and **schema** (see architecture in [CLAUDE.md](./CLAUDE.md)).
- You have run `npm run build` to keep the registry in sync if you touched `src/registry/index.ts`.

Pull requests that do not meet these requirements will not be merged.

## Conclusion

We appreciate your interest in contributing! By following these guidelines you can help us maintain a healthy and productive open-source community. We value your contributions and look forward to your pull requests!

If you have questions of any kind please reach out to us through the issue tracker.

Happy contributing!
