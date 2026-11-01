// The publish rule on its own, away from astro:content, so a spec can import it.
export const isPublished = (date: Date, now: Date) => date <= now;
