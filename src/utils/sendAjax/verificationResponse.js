import { history } from 'src/utils/router';
import { Toast } from 'antd-mobile';

/** 返回结果处理 */
export default class VerificationResponse {
    /** 构造函数 */
    constructor(res, err) {
        this.res = res;
        this.err = err;
    }
    /** 返回结果构建 */
    response = (res = this.res, err = this.err) => {
        return {
            res,
            err,
        };
    }
    /** 错误提示 */
    errorTip = (message) => {
        Toast.info(message, 2, null, false);
    }
    /** 验证/提示/登录跳转等 */
    verification = () => {
        try {
            if (!this.err) {
                // 根据实际开发接口,可做相应的逻辑判断,登录状态等等
                if (this.res.body.status === 232) {
                    history.push('/login', { some: 'state' });
                }
                return this.response(this.res.body, null);
            } else {
                this.errorTip('网络错误!');
                return this.response();
            }
        } catch {
            return this.response();
        }
    }
}