module.exports = function() {
    const compressor = require('node-minify');

    // Using Google Closure Compiler
    compressor.minify({
        compressor: 'gcc',
        input: __dirname + '/public/js/master.js',
        output: __dirname + '/public/js/master.min.js',
        callback: function (err, min) { }
    });
    compressor.minify({
        compressor: 'csso',
        input: __dirname + '/public/css/master.css',
        output: __dirname + '/public/css/master.min.css',
        options: {
            restructureOff: true // turns structure minimization off
        },
        callback: function (err, min) { }
    });
};