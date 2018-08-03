const PUBLIC_PATH = require('path').resolve(__dirname, 'public');
const {initBackendStub} = require('./utils/backend-stub');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: PUBLIC_PATH,
        publicPath: "/public/", //для корректной загрузки стилей
        filename: 'build.js', //была ошибка в названии результ. файла
    },
    devServer: {
        contentBase: PUBLIC_PATH, //index.html должен быть в этой директории, а не в корне(здесь эта опция не обязательна)
        compress: true,
        port: 9000,
        historyApiFallback: true,
        before: initBackendStub //для имитации запроса к api
    }
};
