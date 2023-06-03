module.exports = {
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'google',
        "plugin:vue/vue3-recommended",
        "prettier"
    ],
    plugins : [
      'vue',
    ],
    rules: {
        'indent': ['warn', 4],
        'require-jsdoc': ['off'],
        'no-console': ['off'],
        'no-invalid-this': ['off'],
        'max-len': ['warn', 120, 2],
        'multiline': [1],
        'vue/script-indent': ['warn', 4, {'baseIndent': 0}],
        'vue/html-indent': ['warn', 4, {'baseIndent': 1}],
        'vue/no-v-html': ['off'],
    }
}