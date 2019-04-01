import * as superagent from 'superagent';
import VerificationResponse from './verificationResponse';
import { store, actions } from 'src/utils/myRedux';
/**
 * 请求域名
 */
const getHost = () => {
    return process.env.ENV_CONFIG.DOMAIN;
};

/**
 * 向后台发送请求 调用superagent
 * @param type 请求类型 如:post get 
 * @param uri 请求地址
 * @param params 参数
 */
const sendAjax = (type, uri, params) => {
    return new Promise((resolve) => {
        const options = {
            'Content-Type': 'application/json',
            'Authorization': store.getState().enthusiasmLevel,
        };

        superagent[type](getHost() + uri)
            .set(options)[type === 'get' ? 'query' : 'send'](params)
            .end((err, res) => {
                // 示例: 修改redux 数据
                store.dispatch(actions.setEnthusiasm({ enthusiasmLevel: 1 }));
                resolve(new VerificationResponse(res, err).verification());
            });
            // .timeout(3000);
    });
};

export default sendAjax;
