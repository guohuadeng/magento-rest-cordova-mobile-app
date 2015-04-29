angular.module('app.config', [])
    .constant('Config', {
        baseUrl: 'http://www.kikuu.com/en',
        frames: {
            register: {
                title: 'Register',
                src: 'http://www.kikuu.com/kikuuapp3/register.html'
            }
        }
    });