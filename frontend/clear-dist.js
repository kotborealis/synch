const {unlink} = require('fs');
const glob = require('glob');

glob.sync('build/*.*').forEach(file => unlink(file, () => undefined));