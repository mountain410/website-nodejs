module.exports = function(grunt){
	// 任务的配置数据
	grunt.initConfig({
		watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        //tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
    },


    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    concurrent: {
      tasks: ['nodemon', 'watch',],
      options: {
        logConcurrentOutput: true
      }
    }
	})

	// 加载插件
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.option('force',true);//为了防止因为语法错误而中断服务
	grunt.registerTask('default',['concurrent']);//注册一个初始任务
}