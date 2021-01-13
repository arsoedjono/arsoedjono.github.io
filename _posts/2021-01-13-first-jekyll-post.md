---
layout: post
title: First Jekyll Post!
date: 2021-01-13
categories: site-upgrade
tags: site-upgrade
---

Hey guys! Here is a good news: having a personal site is free and easy now, such as this one!

It's sure it lacks of how a "real" website should be, i.e. database, but it is enough for a simple blog site. This one is made using [Jekyll][jekyll_site]. It is compatible with [Github Pages][github_page] and you can try to set one up by reading [this documentation][github_page_jekyll].

I did a relatively simple step to set this site up:

1. [Create a github page repository][github_page_setup] and clone it
2. Install the latest `jekyll` gem
```bash
gem install jekyll
```
3. Create a new Jekyll site
```bash
jekyll new .
```
4. Follow the instruction in the `Gemfile` by commenting the `jekyll` gem line and uncomment the `github-pages` gem line and install the gems
```bash
bundle install
```
5. Push your code

A little bit different from the Github Page documentation but it is successfully up! I will use this site for blogging and do some web experiments. Hope it went well and see you in the next post!

[github_page]: https://pages.github.com/
[github_page_jekyll]: https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/setting-up-a-github-pages-site-with-jekyll
[github_page_setup]: https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/creating-a-github-pages-site
[jekyll_site]: https://jekyllrb.com/
