/**
 * Pong 响应定义
 * 服务器响应给客户端，用于计算网络延迟
 */
export interface ResPong {
    /** 客户端原始时间戳（毫秒） */
    clientTimestamp: number;
    /** 服务器接收时间戳（毫秒） */
    serverReceiveTimestamp: number;
    /** 服务器发送时间戳（毫秒） */
    serverSendTimestamp: number;
    /** 可选的序列号，用于匹配 ping/pong */
    sequence?: number;
}
