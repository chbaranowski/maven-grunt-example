module.exports = function(grunt) {
  
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
	  
  // Project configuration.
  grunt.initConfig({
	
	  clean: {
		  bower: ["target-grunt"]
	  },
	  
	  wiredep: {
	      app: {
	        src: 'src/main/webapp/**/*.xhtml',
	        ignorePath:  /\.\.\/\.\.\/\.\.\/target-grunt\/simple-blog-jsf\//
	      }
	  },
	  
	  watch: {
	    options: {
	      livereload: true,
	    },
	    bower: {
	      files: ['bower.json'],
	      tasks: ['wiredep']
	    },
	    compass: {
	      files: ['src/main/styles/**/*.{scss,sass}'],
	      tasks: ['compass', 'concat:css']
	    },
	    xhtml: {
	      files: ['src/main/webapp/**/*.xhtml']
	    }
	  },
	  
	  // Compiles Sass to CSS and generates necessary files if requested
	  compass: {
		  dist: { 
		      options: {
		        sassDir: 'src/main/styles',
		        cssDir:  'target-grunt/compass/',
		      }
		  }
	  },
	  
	  bower: {
		    install: {
		    	options: {
		    		copy: false
		    	}
		    }
	  },
	  
	  autoprefixer: {
	      options: {
	        browsers: ['last 1 version']
	      },
	      dist: {
	        files: [{
	          expand: true,
	          cwd: 'target-grunt/simple-blog-jsf/css',
	          src: '{,*/}*.css',
	          dest: 'target-grunt/simple-blog-jsf/css'
	        }]
	      }
	  },
	  
	  concat: {
		 css: {
		    src: ['target-grunt/compass/*.css'],
		    dest: 'target-grunt/simple-blog-jsf/css/main.css',
		 },
	  },
	  
	  cssmin: {
		 dist: {
		    files: {
		      'target-grunt/dist/css/main.css': ['target-grunt/simple-blog-jsf/css/main.css']
		    }
		  }
	  },
	  
	  connect: {
	      options: {
	    	  port: 9090,
	          hostname: 'localhost',
	          livereload: 35729,
	          middleware: function (connect, options) {
	        	  var middlewares = [];
	              
	              // static files js and css
	              middlewares.push(
	                 connect.static('target-grunt')
	              );
	            
	              // setup the proxy
	              middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
	              
	              return middlewares;
	          }
	      },
	      proxies: [
	          {
	            context: '/simple-blog-jsf', 	
	            host: 'localhost', 		
	            port: 8080 				
	          },
	      ]
	  }
  
  });
  
  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    grunt.task.run([
      'bower:install',
      'wiredep',
      'compass',
      'concat:css',
      'configureProxies:server',
      'connect',
      'watch'
    ]);
  });
  
  grunt.registerTask('default', [
    'bower:install',
    'wiredep',
    'compass',
    'concat:css',
    'autoprefixer'
  ]);
  
}