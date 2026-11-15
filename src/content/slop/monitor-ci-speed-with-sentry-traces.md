---
title: 'Trace GitHub Actions jobs in Sentry'
date: 2026-11-21
link: https://blog.sentry.io/monitor-ci-performance-sentry/
---

Sentry has an experimental GitHub app. It sends each finished workflow job to a Sentry project as a trace, with every step as a span. That shows which step of a slow job eats the time.

GitHub reports totals per run. Traces give per-step durations across runs. So when a job takes 9 minutes on one run and 15 on the next, the traces show where the extra minutes went. Sentry's own team used this on a macOS job in its .NET SDK. The Build step took about 44 of 83 minutes. After the team added caching and parallelized tests, the job ran in about 24 minutes.

Setup:

1. Create a Sentry project for CI data. It needs no platform or alerts.
2. Create a private repo named `.sentry` in the account that owns the workflows.
3. Commit a `sentry_config.ini` file to it with the project's DSN:

```ini
[sentry-github-actions-app]
dsn = https://foo@bar.ingest.sentry.io/foobar
```

4. Install the GitHub app, giving it access to `.sentry` and the repos to watch. It reads workflow jobs and that one file, not code.

Two limits apply. The README says Discover needs a Business or Trial plan and Dashboards need a Team plan or higher. The traces also count toward the span quota.

Install it on one busy repo and let a few runs come in. Then sort the jobs by duration and look at the longest step.
