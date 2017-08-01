---
layout: page
title: Essays
permalink: /blog/
---

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    <span class="post-meta"> - {{ post.date | date: "%b %-d, %Y" }}</span>
  </li>
{% endfor %}
</ul>

<a class="rss-subscribe" href="{{ "/feed.xml" | prepend: site.baseurl }}">RSS</a>
