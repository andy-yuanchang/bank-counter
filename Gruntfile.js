const fse = require('fs-extra');
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

module.exports = (grunt) => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env : {
            options : {
                //Shared Options Hash
            },
            prod : {
                // For webpack
                // need to set BABEL_ENV to strip PropTypes
                // but from command line "NODE_ENV=production webpack -p" will strip PropTypes automatically
                BABEL_ENV : 'production'
            }
        },
        webpack: { 
            options: webpackConfig,
            watch: {
                watch: true,
                keepalive: false, // grunt task will be blocked if set keepalive to false, but I got an oppsite result here and I don't know why 
                watchOptions: {
                    poll:1000
                }
            }
        },
        less: {
            files: {
                expand: true,
                cwd: "src/less",
                src: "*.less",
                dest: "css-temp",
                ext: ".css"
            }
        },
        concat: {
            css: {
                src: ['css-temp/*.css'],
                dest: './dist/bundle.css'
            },
        },
        watch: {
            styles: {
                files: ['src/less/**/*.less'], // which files to watch
                tasks: ['build-less'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('clean-less', () => {
        console.log('removing css-temp folder...');
        fse.removeSync('css-temp');
    });
    grunt.registerTask('build-less', () => {
        grunt.task.run('less', 'concat:css', 'clean-less');
    });

    grunt.registerTask('default', ['webpack:watch', 'build-less', 'watch'])
}