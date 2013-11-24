var require = {
    baseUrl: '../src/js',
    paths: {
        'jquery': '../../bower_components/jquery/jquery',
        'extendable': '../../bower_components/extendable.js/dist/extendable',
        'test': '../../test'
    },
    //enable jquery in no conflict mode
    map: {
        '*': {
            'jquery' : 'test/config/jquery-private'
        },
        'test/config/jquery-private': {
            'jquery': 'jquery'
        }
    }
};