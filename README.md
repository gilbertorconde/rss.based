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

https://user-images.githubusercontent.com/1083603/135323320-e8d7ae90-4b23-44a5-bfcf-c54de06209b1.mp4

Yeah, I now, the dogs are not part of the app.
