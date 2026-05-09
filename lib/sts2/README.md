# Slay the Spire 2 Requirement Docs

## Dependencies

- Sprite Generator

## Assets update

1. Open respective STS2 wiki pages:

- [Badge](https://slaythespire.wiki.gg/wiki/Category:Badge_Icons)
- [Enchantments](https://slaythespire.wiki.gg/wiki/Category:Enchantments)
- [Card Images](https://slaythespire.wiki.gg/wiki/Category:StS2_Card_Images) -- currently not saving this because of too many card images
- [Map Icons](https://slaythespire.wiki.gg/wiki/Category:StS2_Map_Icons)

2. Extract image URLs from each page:
   1. Open / modify HTML extractor script in `lib/sts2/html_extractors/*.js`
   2. Copy the content of the file
   3. Inspect the wiki page
   4. Open Console tab
   5. Paste the script
   6. Copy the image URLs
3. Paste the image URLs to each respective file in `lib/sts2/files/*.txt`
4. Download images until all successfully downloaded (may need to manually remove the successful download URL in the file for now)
5. Run the Sprite Generator

```bash
node sprite-generator/generate-sprite.js "sts2/img/badges/*.png" "sts2/badges"
```
