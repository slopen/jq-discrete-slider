module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
less: {
  development: {
    options: {
      paths: ["src"]
    },
    files: {
      "build/<%= pkg.name %>.css": "src/styles.less"
    }
  },
  production: {
    options: {
      paths: ["src"],
      cleancss: true
    },
    files: {
      "build/<%= pkg.name %>.min.css": "src/styles.less"
    }
  }
},
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['src/slider.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['less','uglify']);

};