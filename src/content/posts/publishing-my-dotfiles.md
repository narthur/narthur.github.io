---
title: 'Publishing My Dotfiles'
date: 2025-12-15T17:56:25.568Z
substack: https://narthur.substack.com/p/publishing-my-dotfiles
---

<figure><img src="/writing/publishing-my-dotfiles/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

End of last week I finally gave up on using the HP mini PC I’d been using for work since my MacBook Pro started crashing under work loads. So now I’m using the gaming PC my family gifted me for my last birthday. Not necessarily ideal, but still good fun since it’s a beefy machine!

Thankfully I had previously already switched the PC to running Debian and I’ve been storing my local repositories on an external hard drive, so making the switch hasn’t been too painful. But while I was at it I decided to work toward making it even less painful next time I switch machines.

Enter [my new dotfiles repository](https://github.com/narthur/dotfiles).

I’ve tinkered around with storing computer configurations on GitHub before. But it never stuck that well, probably because the friction to keeping the repo up-to-date to the point where it was useful when I switched computers was just too great.

This time I’m taking a different approach (maybe the approach most people who use dotfiles repos have already been using): I’ve initialized my home directory itself as a git repository.

Doing this made me a bit nervous since I didn’t want to accidentally commit sensitive information. To avoid this I [git-ignored](https://github.com/narthur/dotfiles/blob/main/.gitignore) everything in my home directory (\`\*\`) and have been only unignoring specific files as I see value in adding them to the repo.

If you’re into using [Beeminder](https://www.beeminder.com/) or are generally interested in quantified self stuff, there are already some fun goodies in the setup:

- The main toolbar displays my next due Beeminder goal using \`[buzz](http://github.com/pinepeakdigital/buzz) next\`.
- There’s a [script](https://github.com/narthur/dotfiles/blob/main/bin/get-work-time) that queries my [ActivityWatch](https://activitywatch.net/) data for work time.
- There’s [another script](https://github.com/narthur/dotfiles/blob/main/bin/sync-work-time) that syncs that data to Beeminder (again using Buzz).
- And it includes [a crontab file](https://github.com/narthur/dotfiles/blob/main/.config/crontab) to ensure that sync happens regularly.

I’m quite enjoying using git to track my computer setup. I feel like so far it’s encouraging me to be more thoughtful about how I set up my machine.
