# Na'imullah Aziz — Portfolio

Static portfolio site. No build step, no dependencies: plain HTML, one shared
stylesheet and one shared script.

## Structure

```
index.html        Home: hero, migration notice + deck, featured film, summary
work.html         Work, campaigns and multimedia projects
about.html        Bio, stats and skills
contact.html      Contact details
assets/css/main.css   Shared styles for every page
assets/js/main.js     Shared behaviour (nav, modals, gallery, reveal)
assets/img/       Project images
assets/docs/      CV
```

## Local preview

The site must be served over `http://`, not opened as a local file. YouTube
embeds refuse to play from `file://` and return error 153.

## Theme

Light by default. Add `data-theme="dark"` to the `<html>` tag of any page to
switch that page to the dark palette. All colours live as CSS custom properties
at the top of `assets/css/main.css`.
