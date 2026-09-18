---
title: 'Choosing a Laptop, Updating Buzz, Etc'
date: 2025-11-28T19:27:15.038Z
substack: https://narthur.substack.com/p/choosing-a-laptop-updating-buzz-etc
---

<figure><img src="/writing/choosing-a-laptop-updating-buzz-etc/1.webp" alt="" width="345" height="345" loading="eager"></figure>

Happy Thanksgiving! 🦃

---

I’ve been planning to purchase a new development computer for a while now. I could do it now, but I’m still a bit nervous.

Currently I have three computers:

1. A mini PC running Debian that I use for work.
2. An older MacBook Pro that crashes when I use it for heavy work stuff so it’s been relegated to my personal machine.
3. A beefy gaming PC that was a gift from my family, also running Debian.

I’m planning to be more mobile in the future, so I need a laptop that I can do work on.

I’m very tempted to purchase [a Framework laptop](https://frame.work/) since I really enjoy doing my work on Linux. And the ability to easily repair and upgrade it is appealing.

Unfortunately there are good arguments for me to instead purchase another Apple laptop instead.

- I understand that the Framework laptop’s build quality is worse than an Apple laptop’s.
- I have plenty of experience using Apple laptops as work machines, so I’m highly confident they’ll do everything I need.
- I already own an external Apple keyboard and magic track pad, and these are my preferred peripherals, plus they’re very portable.
- It’s likely I’d be able to acquire an Apple laptop more cheaply than a Framework laptop, since there’s a lot more availability for used and refurbished Apple laptops than Framework laptops.

So unfortunately it feels like the responsible decision is to purchase an Apple laptop and wait until I have some disposable cash to play with before taking a chance on a Framework laptop.

---

I’ve been continuing to add features to [buzz](https://github.com/PinePeakDigital/buzz). In the last week:

- Added support for piping values into the \`buzz add\` command.
- Added \`—json\` and \`—datapoints\` args for the \`buzz view &lt;slug&gt;\` command.
- Tried to improve the usefulness of the buzz update-available messages, though I’m not quite happy with them yet.

---

I’ve been continuing to work hard toward migrating from Firestore to Neon for the database. It’s been a bit tricky since I need to keep the Firestore service while adding the Neon service until the migration is completed. I have a migration built but I’m still trying to get to where I’m more confident that it will work on the first go before I pull the trigger.
