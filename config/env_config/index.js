/**
 * 获取配置的运行环境 例:'npm run build demo' 获取的demo 环境
 * 默认dev
 */
const args = process.argv.slice(2)[0];
let envConfig;
switch (args) {
    case 'dev':
        envConfig = require('./dev');
        break;
    case 'test':
        envConfig = require('./test');
        break;
    case 'production':
        envConfig = require('./production');
        break;
    default:
        envConfig = require('./dev');
        break;
}
module.exports = envConfig;