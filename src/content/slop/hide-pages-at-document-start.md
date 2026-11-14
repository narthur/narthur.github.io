---
title: 'Hide the page at document_start to delay a distracting site'
date: 2026-11-16
link: https://github.com/narthur/Delay-Distraction
---

Delay-Distraction is a small Firefox extension that makes a configured site wait N seconds before loading. The link goes to Nathan's fork, which adds a visible countdown and the hide-first fix below. That trick works for any content script that needs to block a page cleanly.

Reading settings from extension storage before hiding the page fails: storage reads are async, so the site half-renders and then vanishes. The fix is to hide first and decide later. Run the content script at `document_start` and hide the root element synchronously. From the extension's content script:

```js
const root = document.documentElement;
root.style.setProperty('visibility', 'hidden', 'important');
const show = () => root.style.removeProperty('visibility');
getWaitTime(window.location.href).then(waitTime => {
  if (waitTime) {
    showCountdown(waitTime, show);
  } else {
    show();
  }
}).catch(show); // any error must still un-hide the page
```

On a match, the countdown calls `window.stop()`, which halts the site's own loading so nothing runs or plays audio during the countdown. When it ends, set a `sessionStorage` bypass flag and call `location.reload()`. Set the flag only then, or a manual reload mid-countdown skips the delay.

Every page is blank for a few milliseconds while the storage read finishes. For a friction tool, that is fine. One known gap: switching tabs doesn't pause the countdown, so the delay can run out in a background tab.

To use the pattern, copy the hide-first block from the repo into your own extension.
