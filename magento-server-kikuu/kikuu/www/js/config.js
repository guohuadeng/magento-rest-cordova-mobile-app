angular.module('app.config', [])
    .constant('Config', {
        baseUrl: 'http://demo.sunpop.cn/en',
        baseSite: 'http://demo.sunpop.cn/m',
        frames: {
            register: {
                title: 'Register',
                src: 'http://demo.sunpop.cn/kikuuapp3/register.html'
            }
        }
    });