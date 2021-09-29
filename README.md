## Auto generator smartphone apps for RSS Feeds ##

For now just clone the repo, change the entries on the `settings/generator.json` file and build the project.

Just run the `npm install` then `npm start` to start play around.

Feel free to add PR to improve this project (this include the README as well).

## Example
Take a look at this example made with Luke Smith RSS feed:

`settings/generator.json`
```json
{
  "rss_url": "https://notrelated.libsyn.com/rss",
  "colors": {
    "light": {
      "primary": "#00b7ff",
      "title": "#FFFFFF",
      "background": "#00b7ff",
      "card": "#FFFFFF",
      "text": "rgb(28, 28, 30)",
      "border": "rgb(255, 59, 48)",
      "notification": "rgb(28, 28, 30)"
    },
    "dark": {},
    "statusbar": {
      "light": {
        "background": "#00b7ff",
        "style": "light"
      },
      "dark": {}
    }
  },
  "header_size": 215,
  "header_collapsed_size": 0
}
```

https://user-images.githubusercontent.com/1083603/135324120-f4f050ee-9b74-405c-9d32-e119aafe7e44.mov


Yeah, I now, the dogs are not part of the app.
