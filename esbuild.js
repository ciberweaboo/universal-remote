import {build} from "esbuild"

(async() => {
    const startTime = Date.now();

    try {
        await build({
          entryPoints: ['./main.js'],
          bundle: true,
          outfile: './dist/ciberremote.js',
          format: 'iife',
          globalName: 'CiberRemote'
        });
    
        const endTime = Date.now();
        const buildTime = endTime - startTime;
    
        const whenBuildedTime = new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
        console.log('\x1b[32m✔ Done in ' + buildTime + 'ms at ' + whenBuildedTime + '.\x1b[0m');
      } catch (error) {
        console.error('\x1b[31m✖ Build failed:', error, '\x1b[0m');
      }
})();