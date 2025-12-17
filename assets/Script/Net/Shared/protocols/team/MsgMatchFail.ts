/**
 * 【08-19】匹配失败消息
 */
export interface MsgMatchFail {
    /**
     * 失败原因
     */
    reason?: string;
    
    /**
     * 等待时间（秒）
     */
    waitTime?: number;
    
    /**
     * 时间戳
     */
    timestamp?: number;
}
