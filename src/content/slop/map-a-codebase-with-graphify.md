---
title: 'Map a codebase with Graphify'
date: 2026-11-23
link: https://github.com/Graphify-Labs/graphify
---

Graphify is a skill for Claude Code, Cursor, Codex and Gemini CLI. It turns a project into a knowledge graph. You query the graph instead of grepping through files.

Code is parsed locally with tree-sitter, so no LLM is involved and nothing leaves the machine. Docs, PDFs and images get a semantic pass from your assistant's model. Every connection carries a tag. `EXTRACTED` means the source states it outright. `INFERRED` means Graphify resolved it. That separates what was read from what was guessed. The graph is traversable, with no vector index.

Install it with uv or pipx. Python 3.11+ is required:

```bash
uv tool install graphifyy
graphify install
```

Then type this in the assistant, inside the project:

```text
/graphify .
```

The run writes three files to `graphify-out/`. Open `graph.html` in a browser to click through the graph. `GRAPH_REPORT.md` lists the key concepts and surprising connections. `graph.json` serves later queries. Once the graph exists, you can ask it questions from the shell:

```bash
graphify query "how does a request get validated?"
graphify path "FastAPI" "ModelField"
graphify explain "APIRouter"
```

On an unfamiliar codebase, `path` is the useful one. It prints the shortest chain of hops between two concepts, then rates the whole chain by its weakest link.

Pick a repo you haven't opened yet, run `/graphify .`, and read `GRAPH_REPORT.md` before touching any code.
