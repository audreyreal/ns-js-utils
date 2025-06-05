# how to use
## in a tampermonkey script
include it in a @require line in the script header
```
// @require https://gist.githubusercontent.com/audreyreal/99982831414e8566d531f917515d83e9/raw/nationstates-helpers.js
```
## docs
functions from
https://audreyreal.github.io/nsdotjs/

## todo:
- [ ] api client
- [ ] better docs
- [ ] more html site functions
- [ ] sse client
- [ ] migrate to a module exporting NSScript
- [ ] migrate to using a bundler+minifier (bun probably)
- [ ] extract functions from NSScript
- [ ] make an easy way to create custom pages on page=blank
- [ ] migrate to using https://github.com/jakearchibald/idb-keyval for storage of things like main nation
- [ ] integrated puppet manager?
- [ ] add a default user input handler in the form of awaiting a spacebar press