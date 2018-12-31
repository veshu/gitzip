# :zipper_mouth_face: gitzip

This module provides a `gitzip` command that creates zip file ignoring files from `.gitignore` file.

If the source folder doesn't contain `.gitignore` then all files will be zipped.

:bulb: Useful to share the current changes while working on git repository. It complements the git archive where you don't need to commit or stash the changes to create untracked changed file.

## Global command line usage

```
npm install -g gitzip
```
gitzip -d destination.zip -s source/ -x 'destination.zip' -i '.git'

## Command line usage within `package.json` scripts

```
npm install --save-dev gitzip

```

package.json:

```javascript
{
    //...
    "scripts": {
        "build" "...",
        "zip": "gitzip -d bundle.zip -s build/*",
        "upload": "....",
        "deploy": "npm run build && npm run zip && npm run upload"
    }
}
```

## Programmatic usage from within Node.js

```javascript
var zip = require('gitzip');

zip({
  source: 'build/*',
  destination: './destination.zip',
  exclude: ['destination.zip'],
  include: ['.git']
}).then(function() {
  console.log('all done!');
}).catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});

```

### Options

#### source[-s]
    
    * Type: `string`
    * Default: `.` current directory
    
Path to files and folders to include in the zip file. String or Array of Strings. Defaults to current path.
#### destination

    * Type: `string`
    * Default: `submission.zip` at current directory

Path to generated .zip file. Defaults to submission.zip in current path.
#### exclude

    * Type: `string[]`


Array of strings of file pattern to exclude from zip
#### include

    * Type: `string[]`

 Array of strings of file pattern to include in zip. 
 > Note, include has more precedence than exclude

## Node Version

Node 8 or greater

 ## License

 This software is released under the terms of the MIT license.