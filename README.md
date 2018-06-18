# narthur.github.io

My personal website.

`bundle exec jekyll serve`

localhost:4000


Command                                                     | Notes
------------------------------------------------------------|------------------------------------
`docker-compose up -d`                                      | Spin up site
`docker-compose exec site jekyll build --baseurl /`         | Rebuild site
`docker-compose exec site jekyll build --watch --baseurl /` | Watch for changes
`docker logs themehandbook_site_1`                          | View logs
`docker-compose exec site bundle update`                    | Update dependencies