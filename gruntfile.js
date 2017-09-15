module.exports = function(grunt){
	// 任务的配置数据
	grunt.initConfig({
		watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true //重启服务
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        //tasks: ['jshint'],
        options: {
          livereload: true //重启服务
        }
      },
    },


    nodemon: {
      dev: {
        script:'app.js',
        options: {
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
	grunt.loadNpmTasks('grunt-contrib-watch');//监听文件变化，并重新执行注册任务
	grunt.loadNpmTasks('grunt-nodemon');//实时监听app.js 
	grunt.loadNpmTasks('grunt-concurrent');//针对慢任务（less sass coffee等）优化和跑多个阻塞任务

	grunt.option('force',true);//为了防止因为语法错误或警告而中断服务
	grunt.registerTask('default',['concurrent']);//注册一个初始任务
}