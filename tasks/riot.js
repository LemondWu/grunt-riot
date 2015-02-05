/*
 * grunt-riot
 *
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var riot = require('riot'),
		path = require('path');

	grunt.registerMultiTask('riot', 'riot custom tag compule grunt plugin', function () {

		var options = this.options({
			compact : true ,
			expr : true ,
			type : null ,
			template : null,
			fileConfig : null
		});

		var removeInvalidFiles = function(files) {
			return files.src.filter(function(filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});
		};

		var clone = function(obj) {
			return JSON.parse(JSON.stringify(obj));
		};

		var compileRiot = function(code, opts){
			return riot.compile(code,opts)
		};

		var writeFile = function (path, output) {
			grunt.file.write(path, output);
			grunt.log.writeln('File ' + path + ' created.');
		};

		function getOptions(file, options) {
			return options.fileConfig ? options.fileConfig(file,clone(options)) : options;
		}

		this.files.forEach(function (files) {
			var validFiles  = removeInvalidFiles(files);
			validFiles.map(function(file){
				writeFile(
					files.dest ,
					compileRiot( grunt.file.read(file) , getOptions(file,options) )
				);
			});
		});

	});

};
