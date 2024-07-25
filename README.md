![image-8](https://github.com/user-attachments/assets/a72d6293-dac7-4683-95b3-b46c275b8996)

# pull requests with new character packs are welcome!
1. fork repo
2. add a folder for your character images in `src/assets/<name>`
3. run `pnpm node scrape/makeModule.mjs <name>` to generate `<name>.js`
4. add your pack to `src/packs.js`
5. use `pnpm dev` to test your changes locally
6. pull request

there is a script in the `scrape` folder for scraping tiermaker.com, this works except it also will scrape the uploader's profile picture, which causes issues, so if you use this script then make sure to delete that image and then re-run `makeModule.mjs`
