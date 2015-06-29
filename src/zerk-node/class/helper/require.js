zerk.define({
    name: 'zerkNode.helper.require',
}, {
    require: function(path) {
        companion.require(path, {
            require: require,
            zerk: zerk,
            console: console
        });
    }
})