module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.homepage %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        mocha_phantomjs: {
            //all: ['test/**/*.html']
            all: ['test/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        },
        jsdoc : {
            dist : {
                src: ['src/**/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'mocha_phantomjs']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('test', ['jshint', 'mocha_phantomjs']);
    grunt.registerTask('doc', ['jshint', 'mochaTest', 'jsdoc']);
    grunt.registerTask('default', ['jshint', 'mocha_phantomjs', 'concat', 'uglify']);
};