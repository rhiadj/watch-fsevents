var path = require("path");

const fsevents = require('fsevents');

const scriptArgs = process.argv.slice(2);
const watchDir = path.resolve(scriptArgs[0] || __dirname) + '/';

console.log(`Watching ${watchDir}\n\n`);

// To start observation
let spacerTimeout;
const stop = fsevents.watch(watchDir, (watchPath, flags, id) => {
  const info = fsevents.getInfo(watchPath, flags, id);
  let { path, event, type, changes: { inode } } = info;
  path = path.replace(watchDir, "");
  
  if (path.includes('/node_modules/')
    || path.endsWith('/.visited-gradle')
    || path.endsWith('/.visited-composite')
    || path.endsWith('.json')
    || path.endsWith('.salive')
    || event === 'unknown') {
    return;
  }
  
  if (inode && event === 'created') {
    event = 'changed';
  }
  
  console.log(`${event} ${type} : ${path}`);
  
  clearTimeout(spacerTimeout);
  spacerTimeout = setTimeout(() => {
  	console.log("\n\n");
  }, 1000);
});

// To end observation - run for x mins
const runForMins = 30;
const runForTimeout = runForMins * 60 * 1000;
setTimeout(() => {
  stop();
}, runForTimeout);