# Guitar Learning Platform — Claude Guidelines

## Token Efficiency

**Warn before entering any cyclical or expensive setup loop.**

If completing a step requires downloading tools, installing dependencies, or resolving a chain of missing prerequisites, STOP and surface a warning to the user before proceeding. Be explicit:

> ⚠️ **Warning:** To verify this in the browser I need to download X (~YMB). That will take time and burn tokens. Should I proceed, or skip the manual verification step?

Never silently download browsers, install packages, or spin up infrastructure as part of a verification step — always ask first.

## Versioning

Version is stored in `package.json` (`"version"`) and displayed on the Dashboard. Use semantic versioning (`MAJOR.MINOR.PATCH`):

- **PATCH** (`0.1.0` → `0.1.1`): bug fixes, copy tweaks, style adjustments
- **MINOR** (`0.1.0` → `0.2.0`): new features or pages added
- **MAJOR** (`0.1.0` → `1.0.0`): significant milestone or breaking change

**When committing new features or fixes, prompt the user to confirm a version bump before committing.** Suggest the appropriate bump based on the change type. The version bump should be included in the same commit as the work, with the commit message noting the new version (e.g. `chore: bump to v0.2.0`).
