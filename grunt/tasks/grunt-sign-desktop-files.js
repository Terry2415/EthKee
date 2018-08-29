module.exports = function (grunt) {
    grunt.registerMultiTask('sign-desktop-files', 'Signs desktop files', async function () {
        const done = this.async();
        const fs = require('fs');
        const path = require('path');
        const sign = require('../lib/sign');
        const appPath = this.options().path;

        const signatures = {};
        const signedFiles = [];
        await walk(appPath);

        const data = JSON.stringify(signatures);
        signatures.kwResSelf = await getSignature(Buffer.from(data));
        grunt.file.write(path.join(appPath, 'signatures.json'), JSON.stringify(signatures));

        grunt.log.writeln(`\nSigned ${signedFiles.length} files: ${signedFiles.join(', ')}`);
        done();

        async function walk(dir) {
            const list = fs.readdirSync(dir);
            for (const fileName of list) {
                const file = dir + '/' + fileName;
                const stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    await walk(file);
                } else {
                    const relFile = file.substr(appPath.length + 1);
                    const fileData = grunt.file.read(file, { encoding: null });
                    signatures[relFile] = await getSignature(fileData);
                    signedFiles.push(relFile);
                }
            }
        }

        async function getSignature(data) {
            const signature = await sign(grunt, data);
            grunt.log.write('.');
            return signature.toString('base64');
        }
    });
};
