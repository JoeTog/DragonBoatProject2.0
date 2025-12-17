/**
 * Ping 请求定义
 * 客户端发送给服务器，用于测量网络延迟
 */
export interface ReqPing {
    /** 客户端发送时间戳（毫秒） */
    clientTimestamp: number;
    /** 可选的序列号，用于匹配 ping/pong */
    sequence?: number;
}
