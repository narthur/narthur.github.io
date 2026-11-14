---
title: 'Assess an idea with Spec Kit before building it'
date: 2026-11-18
link: https://github.com/github/spec-kit
---

Spec Kit is GitHub's open source toolkit. It gives a coding agent structured processes, templates and written outcomes. One of its processes assesses an idea: it gathers evidence on whether the idea deserves investment and ends in a recorded decision. It needs no source code.

Setup needs Python 3.11+, uv and a supported coding agent. Install the CLI and create a project. Then, from the project directory, add the assessment extension:

```bash
uv tool install specify-cli
specify init my-project --integration copilot
specify extension add assess
```

Run the stages in the agent's chat, one at a time. The README says to review each result before continuing:

```text
/speckit-assess-intake "Let users work offline and sync when they reconnect." slug=offline-mode
/speckit-assess-research slug=offline-mode
/speckit-assess-define slug=offline-mode
/speckit-assess-shape slug=offline-mode
/speckit-assess-decide slug=offline-mode
```

The artifacts land in `.specify/assessments/offline-mode/`. The decision is `go`, `needs-clarification` or `kill`. To resolve unknowns, edit the Markdown artifacts without rerunning whole stages. The syntax above is for GitHub Copilot's integration, so other agents use their own invocation syntax, listed in the docs.

Stopping with a documented reason is also a useful outcome. So pick one idea that has sat unbuilt in a backlog and run intake on it today.
