export interface BaseRequest {
    __ssoToken?: string;
}

export interface BaseResponse {
    __ssoToken?: string;
}

export interface BaseConf {
    needLogin?: boolean,
    needRoles?: string[]
}

export interface BaseMessage {

}