# narthur.github.io

My personal website.

`bundle exec jekyll serve`

localhost:4000

Command                                                     | Notes
------------------------------------------------------------|------------------------------------
`docker-compose up`                                         | Spin up site
`docker-compose exec site jekyll build --baseurl /`         | Rebuild site
`docker-compose exec site jekyll build --watch --baseurl /` | Watch for changes
`docker logs container_name`                                | View logs
`docker-compose run site bundle update`                     | Update dependencies

- https://github.com/wildlyinaccurate/jekyll-responsive-image
- https://www.shopify.com/partners/shopify-cheat-sheet