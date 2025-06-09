# how to use
## in a tampermonkey script
include it in a @require line in the script header
```
// @require https://gist.githubusercontent.com/audreyreal/99982831414e8566d531f917515d83e9/raw/nsdotjs.js
```
## docs
functions from
https://audreyreal.github.io/nsdotjs/

## todo:
- [ ] api client
- [X] (slightly) better docs
- [X] more html site functions
- [ ] sse client
- [X] migrate to a module exporting NSScript
- [X] migrate to using a bundler+minifier (bun probably)
- [X] extract functions from NSScript
- [ ] make an easy way to create custom pages on page=blank
- [X] migrate to using https://github.com/jakearchibald/idb-keyval for storage of things like main nation
- [ ] integrated puppet manager?
- [ ] add a default user input handler in the form of awaiting a spacebar press

## how to dev

1. clone the repo
2. run `npm install`
3. run `npm run build`