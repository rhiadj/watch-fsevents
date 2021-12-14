const fsevents = require('fsevents');

const watchDir = "/Users/Shared/Stuff/Personal/Work/JPMC/Development/jpmlabs-ui-multiplatform/build/";

console.log(`Watching ${watchDir}\n`);

// To start observation
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
});

// To end observation - run for x mins
const runForMins = 30;
const runForTimeout = runForMins * 60 * 1000;
setTimeout(() => {
	stop();
}, runForTimeout);