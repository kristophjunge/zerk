var path = require('path');

zerk.define({
    name: 'zerkNode.helper.path',
}, {
    init: function(srcPath) {
        this.src = srcPath;
        this.zerk = path.resolve(this.src, 'zerk');
        this.zerknode = path.resolve(this.src, 'zerk-node');
    },
    get: function(path) {
        return this[path];
    }
})