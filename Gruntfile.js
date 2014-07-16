'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		simplemocha: {
			test: {
				src: ['test/*.js'],
				options: {
					globals: ['should'],
					timeout: 3000,
					ignoreLeaks: false,
					ui: 'bdd',
					reporter: 'tap'
				}
			}
		},
		jshint: {
			options: {
			},
			gruntfile: {
				src: 'Gruntfile.js',
				options: {
					jshintrc: '.jshintrc'
				}
			},
			lib: {
				src: ['lib/*.js', 'lib/**/*.js'],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			test: {
				src: ['test/*.js', 'test/**/*.js'],
				options: {
					jshintrc: 'test/.jshintrc'
				}
			}
		},
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: ['lib/*.js', 'lib/**/*.js'],
				tasks: ['jshint:lib']
			},
			test: {
				files: ['test/*.js', 'test/**/*.js'],
				tasks: ['jshint:test']
			}
		}
	});

	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['jshint', 'simplemocha']);
	grunt.registerTask('default', ['test']);
};
