import { ServiceProto } from 'tsrpc-proto';
import { ReqCheckMaintenance, ResCheckMaintenance } from './common/PtlCheckMaintenance';
import { ReqGetGameConfig, ResGetGameConfig } from './PtlGetGameConfig';
import { MsgDie } from './room/MsgDie';
import { MsgGameEnd } from './room/MsgGameEnd';
import { MsgGameTime } from './room/MsgGameTime';
import { MsgTaskComplete } from './room/MsgTaskComplete';
import { MsgTaskCountdown } from './room/MsgTaskCountdown';
import { MsgTaskEnd } from './room/MsgTaskEnd';
import { MsgTaskProgress } from './room/MsgTaskProgress';
import { MsgTaskRecover } from './room/MsgTaskRecover';
import { MsgTaskStart } from './room/MsgTaskStart';
import { ReqAddPower, ResAddPower } from './room/PtlAddPower';
import { ReqGetRoomInfo, ResGetRoomInfo } from './room/PtlGetRoomInfo';
import { ReqBuyItem, ResBuyItem } from './shop/PtlBuyItem';
import { ReqExchangePoint, ResExchangePoint } from './shop/PtlExchangePoint';
import { ReqGetItemList, ResGetItemList } from './shop/PtlGetItemList';
import { ReqMergeItem, ResMergeItem } from './shop/PtlMergeItem';
import { ReqUseItem, ResUseItem } from './shop/PtlUseItem';
import { MsgMatchFail } from './team/MsgMatchFail';
import { MsgMatchSuccess } from './team/MsgMatchSuccess';
import { MsgTeamClose } from './team/MsgTeamClose';
import { MsgTeamJoin } from './team/MsgTeamJoin';
import { MsgTeamLeave } from './team/MsgTeamLeave';
import { MsgTeamListAdd } from './team/MsgTeamListAdd';
import { MsgTeamListRemove } from './team/MsgTeamListRemove';
import { MsgTeamListUpdate } from './team/MsgTeamListUpdate';
import { MsgTeamPowerUpdate } from './team/MsgTeamPowerUpdate';
import { MsgTeamStatusChange } from './team/MsgTeamStatusChange';
import { ReqCancelMatching, ResCancelMatching } from './team/PtlCancelMatching';
import { ReqCreateTeam, ResCreateTeam } from './team/PtlCreateTeam';
import { ReqGetTeamInfo, ResGetTeamInfo } from './team/PtlGetTeamInfo';
import { ReqGetTeamList, ResGetTeamList } from './team/PtlGetTeamList';
import { ReqGetTeamPlayerInfo, ResGetTeamPlayerInfo } from './team/PtlGetTeamPlayerInfo';
import { ReqJoinTeam, ResJoinTeam } from './team/PtlJoinTeam';
import { ReqKick, ResKick } from './team/PtlKick';
import { ReqLeaveTeam, ResLeaveTeam } from './team/PtlLeaveTeam';
import { ReqMatching, ResMatching } from './team/PtlMatching';
import { MsgLuckyBagRes } from './user/MsgLuckyBagRes';
import { ReqChecktoken, ResChecktoken } from './user/PtlChecktoken';
import { ReqGetEliminationRecords, ResGetEliminationRecords } from './user/PtlGetEliminationRecords';
import { ReqGetGameRecord, ResGetGameRecord } from './user/PtlGetGameRecord';
import { ReqGetInfo, ResGetInfo } from './user/PtlGetInfo';
import { ReqGetPowerRecord, ResGetPowerRecord } from './user/PtlGetPowerRecord';
import { ReqGetStatus, ResGetStatus } from './user/PtlGetStatus';
import { ReqGetTaskMessages, ResGetTaskMessages } from './user/PtlGetTaskMessages';
import { ReqLogin, ResLogin } from './user/PtlLogin';
import { ReqMarkTaskMessagesRead, ResMarkTaskMessagesRead } from './user/PtlMarkTaskMessagesRead';
import { ReqReadTaskMessage, ResReadTaskMessage } from './user/PtlReadTaskMessage';
import { ReqSubmitFeedback, ResSubmitFeedback } from './user/PtlSubmitFeedback';
import { ReqUnfreezePowerRecord, ResUnfreezePowerRecord } from './user/PtlUnfreezePowerRecord';

export interface ServiceType {
    api: {
        "common/CheckMaintenance": {
            req: ReqCheckMaintenance,
            res: ResCheckMaintenance
        },
        "GetGameConfig": {
            req: ReqGetGameConfig,
            res: ResGetGameConfig
        },
        "room/AddPower": {
            req: ReqAddPower,
            res: ResAddPower
        },
        "room/GetRoomInfo": {
            req: ReqGetRoomInfo,
            res: ResGetRoomInfo
        },
        "shop/BuyItem": {
            req: ReqBuyItem,
            res: ResBuyItem
        },
        "shop/ExchangePoint": {
            req: ReqExchangePoint,
            res: ResExchangePoint
        },
        "shop/GetItemList": {
            req: ReqGetItemList,
            res: ResGetItemList
        },
        "shop/MergeItem": {
            req: ReqMergeItem,
            res: ResMergeItem
        },
        "shop/UseItem": {
            req: ReqUseItem,
            res: ResUseItem
        },
        "team/CancelMatching": {
            req: ReqCancelMatching,
            res: ResCancelMatching
        },
        "team/CreateTeam": {
            req: ReqCreateTeam,
            res: ResCreateTeam
        },
        "team/GetTeamInfo": {
            req: ReqGetTeamInfo,
            res: ResGetTeamInfo
        },
        "team/GetTeamList": {
            req: ReqGetTeamList,
            res: ResGetTeamList
        },
        "team/GetTeamPlayerInfo": {
            req: ReqGetTeamPlayerInfo,
            res: ResGetTeamPlayerInfo
        },
        "team/JoinTeam": {
            req: ReqJoinTeam,
            res: ResJoinTeam
        },
        "team/Kick": {
            req: ReqKick,
            res: ResKick
        },
        "team/LeaveTeam": {
            req: ReqLeaveTeam,
            res: ResLeaveTeam
        },
        "team/Matching": {
            req: ReqMatching,
            res: ResMatching
        },
        "user/Checktoken": {
            req: ReqChecktoken,
            res: ResChecktoken
        },
        "user/GetEliminationRecords": {
            req: ReqGetEliminationRecords,
            res: ResGetEliminationRecords
        },
        "user/GetGameRecord": {
            req: ReqGetGameRecord,
            res: ResGetGameRecord
        },
        "user/GetInfo": {
            req: ReqGetInfo,
            res: ResGetInfo
        },
        "user/GetPowerRecord": {
            req: ReqGetPowerRecord,
            res: ResGetPowerRecord
        },
        "user/GetStatus": {
            req: ReqGetStatus,
            res: ResGetStatus
        },
        "user/GetTaskMessages": {
            req: ReqGetTaskMessages,
            res: ResGetTaskMessages
        },
        "user/Login": {
            req: ReqLogin,
            res: ResLogin
        },
        "user/MarkTaskMessagesRead": {
            req: ReqMarkTaskMessagesRead,
            res: ResMarkTaskMessagesRead
        },
        "user/ReadTaskMessage": {
            req: ReqReadTaskMessage,
            res: ResReadTaskMessage
        },
        "user/SubmitFeedback": {
            req: ReqSubmitFeedback,
            res: ResSubmitFeedback
        },
        "user/UnfreezePowerRecord": {
            req: ReqUnfreezePowerRecord,
            res: ResUnfreezePowerRecord
        }
    },
    msg: {
        "room/Die": MsgDie,
        "room/GameEnd": MsgGameEnd,
        "room/GameTime": MsgGameTime,
        "room/TaskComplete": MsgTaskComplete,
        "room/TaskCountdown": MsgTaskCountdown,
        "room/TaskEnd": MsgTaskEnd,
        "room/TaskProgress": MsgTaskProgress,
        "room/TaskRecover": MsgTaskRecover,
        "room/TaskStart": MsgTaskStart,
        "team/MatchFail": MsgMatchFail,
        "team/MatchSuccess": MsgMatchSuccess,
        "team/TeamClose": MsgTeamClose,
        "team/TeamJoin": MsgTeamJoin,
        "team/TeamLeave": MsgTeamLeave,
        "team/TeamListAdd": MsgTeamListAdd,
        "team/TeamListRemove": MsgTeamListRemove,
        "team/TeamListUpdate": MsgTeamListUpdate,
        "team/TeamPowerUpdate": MsgTeamPowerUpdate,
        "team/TeamStatusChange": MsgTeamStatusChange,
        "user/LuckyBagRes": MsgLuckyBagRes
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 14,
    "services": [
        {
            "id": 0,
            "name": "common/CheckMaintenance",
            "type": "api",
            "conf": {
                "needLogin": false
            }
        },
        {
            "id": 1,
            "name": "GetGameConfig",
            "type": "api",
            "conf": {}
        },
        {
            "id": 2,
            "name": "room/Die",
            "type": "msg"
        },
        {
            "id": 3,
            "name": "room/GameEnd",
            "type": "msg"
        },
        {
            "id": 4,
            "name": "room/GameTime",
            "type": "msg"
        },
        {
            "id": 5,
            "name": "room/TaskComplete",
            "type": "msg"
        },
        {
            "id": 6,
            "name": "room/TaskCountdown",
            "type": "msg"
        },
        {
            "id": 7,
            "name": "room/TaskEnd",
            "type": "msg"
        },
        {
            "id": 8,
            "name": "room/TaskProgress",
            "type": "msg"
        },
        {
            "id": 9,
            "name": "room/TaskRecover",
            "type": "msg"
        },
        {
            "id": 10,
            "name": "room/TaskStart",
            "type": "msg"
        },
        {
            "id": 11,
            "name": "room/AddPower",
            "type": "api",
            "conf": {
                "needLogin": false
            }
        },
        {
            "id": 12,
            "name": "room/GetRoomInfo",
            "type": "api",
            "conf": {
                "needLogin": false
            }
        },
        {
            "id": 13,
            "name": "shop/BuyItem",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 14,
            "name": "shop/ExchangePoint",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 15,
            "name": "shop/GetItemList",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 16,
            "name": "shop/MergeItem",
            "type": "api",
            "conf": {}
        },
        {
            "id": 17,
            "name": "shop/UseItem",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 18,
            "name": "team/MatchFail",
            "type": "msg"
        },
        {
            "id": 19,
            "name": "team/MatchSuccess",
            "type": "msg"
        },
        {
            "id": 20,
            "name": "team/TeamClose",
            "type": "msg"
        },
        {
            "id": 21,
            "name": "team/TeamJoin",
            "type": "msg"
        },
        {
            "id": 22,
            "name": "team/TeamLeave",
            "type": "msg"
        },
        {
            "id": 23,
            "name": "team/TeamListAdd",
            "type": "msg"
        },
        {
            "id": 24,
            "name": "team/TeamListRemove",
            "type": "msg"
        },
        {
            "id": 25,
            "name": "team/TeamListUpdate",
            "type": "msg"
        },
        {
            "id": 26,
            "name": "team/TeamPowerUpdate",
            "type": "msg"
        },
        {
            "id": 27,
            "name": "team/TeamStatusChange",
            "type": "msg"
        },
        {
            "id": 28,
            "name": "team/CancelMatching",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 29,
            "name": "team/CreateTeam",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 30,
            "name": "team/GetTeamInfo",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 31,
            "name": "team/GetTeamList",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 32,
            "name": "team/GetTeamPlayerInfo",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 33,
            "name": "team/JoinTeam",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 34,
            "name": "team/Kick",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 35,
            "name": "team/LeaveTeam",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 36,
            "name": "team/Matching",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 37,
            "name": "user/LuckyBagRes",
            "type": "msg"
        },
        {
            "id": 38,
            "name": "user/Checktoken",
            "type": "api",
            "conf": {}
        },
        {
            "id": 39,
            "name": "user/GetEliminationRecords",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 40,
            "name": "user/GetGameRecord",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 41,
            "name": "user/GetInfo",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 42,
            "name": "user/GetPowerRecord",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 43,
            "name": "user/GetStatus",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 44,
            "name": "user/GetTaskMessages",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 45,
            "name": "user/Login",
            "type": "api",
            "conf": {}
        },
        {
            "id": 46,
            "name": "user/MarkTaskMessagesRead",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 47,
            "name": "user/ReadTaskMessage",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 49,
            "name": "user/SubmitFeedback",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        },
        {
            "id": 48,
            "name": "user/UnfreezePowerRecord",
            "type": "api",
            "conf": {
                "needLogin": true
            }
        }
    ],
    "types": {
        "common/PtlCheckMaintenance/ReqCheckMaintenance": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "common/PtlCheckMaintenance/ResCheckMaintenance": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "isMaintenance",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "maintenanceMessage",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "PtlGetGameConfig/ReqGetGameConfig": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "PtlGetGameConfig/ResGetGameConfig": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "game_notice",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "game_desc",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "match_start_hour",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "match_end_hour",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "match_allowed_days",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                }
            ]
        },
        "room/MsgDie/MsgDie": {
            "type": "Interface"
        },
        "room/MsgGameEnd/MsgGameEnd": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "winIndex",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "powerInfo",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                },
                {
                    "id": 2,
                    "name": "reward",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "win_gem",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "gem",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 2,
                                "name": "freeze",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "msg",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "playerStatus",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "power",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "isdie",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "freezePower",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "eliminationRecordId",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "room/MsgGameTime/MsgGameTime": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "status",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Enmu/RoomStatus"
                    }
                },
                {
                    "id": 1,
                    "name": "time",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "playerPowerCur",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "info",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "powerMax",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "powerCur",
                                    "type": {
                                        "type": "Number"
                                    }
                                }
                            ]
                        }
                    },
                    "optional": true
                }
            ]
        },
        "../models/Enmu/RoomStatus": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 0
                },
                {
                    "id": 1,
                    "value": 1
                },
                {
                    "id": 2,
                    "value": 2
                },
                {
                    "id": 3,
                    "value": 3
                }
            ]
        },
        "room/MsgTaskComplete/MsgTaskComplete": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "success",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "earnedPower",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "restDuration",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "room/MsgTaskCountdown/MsgTaskCountdown": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "taskIndex",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "remainingTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "status",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "active"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "rest"
                                }
                            },
                            {
                                "id": 2,
                                "type": {
                                    "type": "Literal",
                                    "literal": "completed"
                                }
                            },
                            {
                                "id": 3,
                                "type": {
                                    "type": "Literal",
                                    "literal": "failed"
                                }
                            },
                            {
                                "id": 4,
                                "type": {
                                    "type": "Literal",
                                    "literal": "eliminated"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 3,
                    "name": "currentSwipes",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "targetSwipes",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "room/MsgTaskEnd/MsgTaskEnd": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "taskIndex",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "success",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 2,
                    "name": "reason",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "completed"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "timeout"
                                }
                            },
                            {
                                "id": 2,
                                "type": {
                                    "type": "Literal",
                                    "literal": "failed"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 3,
                    "name": "finalSwipes",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "targetSwipes",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "earnedPower",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "room/MsgTaskProgress/MsgTaskProgress": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "currentSwipes",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "targetSwipes",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "remainingTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "isCompleted",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                }
            ]
        },
        "room/MsgTaskRecover/MsgTaskRecover": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "taskIndex",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "duration",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "targetSwipes",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "currentSwipes",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "remainingTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "status",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "active"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "rest"
                                }
                            },
                            {
                                "id": 2,
                                "type": {
                                    "type": "Literal",
                                    "literal": "failed"
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "room/MsgTaskStart/MsgTaskStart": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "taskIndex",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "duration",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "targetSwipes",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "room/PtlAddPower/ReqAddPower": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "value",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "room/PtlAddPower/ResAddPower": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "value",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "serverTimestamp",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "room/PtlGetRoomInfo/ReqGetRoomInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "room/PtlGetRoomInfo/ResGetRoomInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "room",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/IRoom"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "roomIndex",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "info",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "name",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "avatar",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "count",
                                    "type": {
                                        "type": "Number"
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    "id": 3,
                    "name": "serverTimestamp",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "gameStartTimestamp",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "currentPhaseStartTimestamp",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "currentTask",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Interface",
                                    "properties": [
                                        {
                                            "id": 0,
                                            "name": "taskIndex",
                                            "type": {
                                                "type": "Number"
                                            }
                                        },
                                        {
                                            "id": 1,
                                            "name": "status",
                                            "type": {
                                                "type": "String"
                                            }
                                        },
                                        {
                                            "id": 2,
                                            "name": "duration",
                                            "type": {
                                                "type": "Number"
                                            }
                                        },
                                        {
                                            "id": 3,
                                            "name": "targetSwipes",
                                            "type": {
                                                "type": "Number"
                                            }
                                        },
                                        {
                                            "id": 4,
                                            "name": "currentSwipes",
                                            "type": {
                                                "type": "Number"
                                            }
                                        },
                                        {
                                            "id": 5,
                                            "name": "remainingTime",
                                            "type": {
                                                "type": "Number"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": null
                                }
                            }
                        ]
                    },
                    "optional": true
                }
            ]
        },
        "../models/Interfaces/IRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "teams",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/ITeam"
                        }
                    }
                },
                {
                    "id": 2,
                    "name": "status",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Enmu/RoomStatus"
                    }
                },
                {
                    "id": 3,
                    "name": "time",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../models/Interfaces/ITeam": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/ITeamBase"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "password",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "onlineCount",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "totalCount",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "captainUid",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "players",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/IPlayer"
                        }
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "allPowerCur",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "roomId",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "roomIndex",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "../models/Interfaces/ITeamBase": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "playersCount",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "maxCount",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "avatar",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "status",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "hasPassword",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                }
            ]
        },
        "../models/Interfaces/IPlayer": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "user",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/IUser"
                    }
                },
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "power",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "powerCur",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "point",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "total_games",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 6,
                    "name": "win_games",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 7,
                    "name": "extra_ratio",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 8,
                    "name": "bag_data",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/EnrichedBagItem"
                        }
                    },
                    "optional": true
                },
                {
                    "id": 9,
                    "name": "captain",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 10,
                    "name": "times",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 11,
                    "name": "times_max",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 18,
                    "name": "totalTimesLimit",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 19,
                    "name": "totalTimesUsed",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 12,
                    "name": "difficulty",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "frequency",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "add",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 2,
                                "name": "reduce",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 13,
                    "name": "isdie",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 14,
                    "name": "teamId",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 15,
                    "name": "virtual",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 16,
                    "name": "freezePower",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 17,
                    "name": "player_code",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "../models/Interfaces/IUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "account",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "nickname",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "avatar",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "level",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "game_coin",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "useful_member",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "draw_gem",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 8,
                    "name": "user_type",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "../models/Interfaces/EnrichedBagItem": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/BagItem"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "price",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "desc",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "use",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "status",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../models/Interfaces/BagItem": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "count",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "shop/PtlBuyItem/ReqBuyItem": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "shop/PtlBuyItem/ResBuyItem": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "shop/PtlExchangePoint/ReqExchangePoint": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "count",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "shop/PtlExchangePoint/ResExchangePoint": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "game_coin",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "point",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "power",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "freezePower",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "shop/PtlGetItemList/ReqGetItemList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "shop/PtlGetItemList/ResGetItemList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "items",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/IShopItem"
                        }
                    }
                }
            ]
        },
        "../models/Interfaces/IShopItem": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "price",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "desc",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "use",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "status",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "shop/PtlMergeItem/ReqMergeItem": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "index0",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "index1",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "index2",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "shop/PtlMergeItem/ResMergeItem": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "bag_data",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/EnrichedBagItem"
                        }
                    }
                }
            ]
        },
        "shop/PtlUseItem/ReqUseItem": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "shop/PtlUseItem/ResUseItem": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "bag_data",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/EnrichedBagItem"
                        }
                    }
                },
                {
                    "id": 1,
                    "name": "isdie",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "freezePower",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "msg",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "team/MsgMatchFail/MsgMatchFail": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "reason",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "waitTime",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "timestamp",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "team/MsgMatchSuccess/MsgMatchSuccess": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "roomId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "roomIndex",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "info",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "name",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "avatar",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "count",
                                    "type": {
                                        "type": "Number"
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    "id": 3,
                    "name": "gameItems",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                }
            ]
        },
        "team/MsgTeamClose/MsgTeamClose": {
            "type": "Interface"
        },
        "team/MsgTeamJoin/MsgTeamJoin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "player",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/IPlayer"
                    }
                }
            ]
        },
        "team/MsgTeamLeave/MsgTeamLeave": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "team/MsgTeamListAdd/MsgTeamListAdd": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "team",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/ITeamBase"
                    }
                }
            ]
        },
        "team/MsgTeamListRemove/MsgTeamListRemove": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "team/MsgTeamListUpdate/MsgTeamListUpdate": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "team",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/ITeamBase"
                    }
                }
            ]
        },
        "team/MsgTeamPowerUpdate/MsgTeamPowerUpdate": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "allPowerCur",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "team/MsgTeamStatusChange/MsgTeamStatusChange": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "teamId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "status",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Enmu/TeamStatus"
                    }
                }
            ]
        },
        "../models/Enmu/TeamStatus": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 0
                },
                {
                    "id": 1,
                    "value": 1
                },
                {
                    "id": 2,
                    "value": 2
                }
            ]
        },
        "team/PtlCancelMatching/ReqCancelMatching": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "team/PtlCancelMatching/ResCancelMatching": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "team/PtlCreateTeam/ReqCreateTeam": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "teamName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "team/PtlCreateTeam/ResCreateTeam": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "inTeam",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 2,
                    "name": "inGame",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 3,
                    "name": "error",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "team/PtlGetTeamInfo/ReqGetTeamInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "team/PtlGetTeamInfo/ResGetTeamInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "hasTeam",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "info",
                    "type": {
                        "type": "Reference",
                        "target": "../models/Interfaces/ITeam"
                    }
                }
            ]
        },
        "team/PtlGetTeamList/ReqGetTeamList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "team/PtlGetTeamList/ResGetTeamList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "teams",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/ITeamBase"
                        }
                    }
                }
            ]
        },
        "team/PtlGetTeamPlayerInfo/ReqGetTeamPlayerInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "team/PtlGetTeamPlayerInfo/ResGetTeamPlayerInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "info",
                    "type": {
                        "type": "Intersection",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Reference",
                                    "target": "../models/Interfaces/IUser"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Reference",
                                    "target": "../models/Interfaces/IPlayer"
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "team/PtlJoinTeam/ReqJoinTeam": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "team/PtlJoinTeam/ResJoinTeam": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "team/PtlKick/ReqKick": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "team/PtlKick/ResKick": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "team/PtlLeaveTeam/ReqLeaveTeam": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "team/PtlLeaveTeam/ResLeaveTeam": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "team/PtlMatching/ReqMatching": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "team/PtlMatching/ResMatching": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "user/MsgLuckyBagRes/MsgLuckyBagRes": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "countAll",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "countGet",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "countFreeze",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "user/PtlChecktoken/ReqChecktoken": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlChecktoken/ResChecktoken": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "result",
                    "type": {
                        "type": "Boolean"
                    }
                }
            ]
        },
        "user/PtlGetEliminationRecords/ReqGetEliminationRecords": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "page",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "pageSize",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "unfreezeStatus",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "can_unfreeze"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "unfreezing"
                                }
                            },
                            {
                                "id": 2,
                                "type": {
                                    "type": "Literal",
                                    "literal": "unfrozen"
                                }
                            },
                            {
                                "id": 3,
                                "type": {
                                    "type": "Literal",
                                    "literal": "expired"
                                }
                            },
                            {
                                "id": 4,
                                "type": {
                                    "type": "Literal",
                                    "literal": "cancelled"
                                }
                            },
                            {
                                "id": 5,
                                "type": {
                                    "type": "Literal",
                                    "literal": "can_revive"
                                }
                            },
                            {
                                "id": 6,
                                "type": {
                                    "type": "Literal",
                                    "literal": "revived"
                                }
                            }
                        ]
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlGetEliminationRecords/ResGetEliminationRecords": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "list",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "id",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "type",
                                    "type": {
                                        "type": "Literal",
                                        "literal": "freeze"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "operationType",
                                    "type": {
                                        "type": "Literal",
                                        "literal": "elimination"
                                    }
                                },
                                {
                                    "id": 3,
                                    "name": "amount",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 4,
                                    "name": "reason",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 5,
                                    "name": "time",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 6,
                                    "name": "unfreezeStatus",
                                    "type": {
                                        "type": "Union",
                                        "members": [
                                            {
                                                "id": 0,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "can_unfreeze"
                                                }
                                            },
                                            {
                                                "id": 1,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "unfreezing"
                                                }
                                            },
                                            {
                                                "id": 2,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "unfrozen"
                                                }
                                            },
                                            {
                                                "id": 3,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "expired"
                                                }
                                            },
                                            {
                                                "id": 4,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "cancelled"
                                                }
                                            },
                                            {
                                                "id": 5,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "can_revive"
                                                }
                                            },
                                            {
                                                "id": 6,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "revived"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "id": 7,
                                    "name": "freezeAmount",
                                    "type": {
                                        "type": "Number"
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    "id": 1,
                    "name": "total",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "page",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "pageSize",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "user/PtlGetGameRecord/ReqGetGameRecord": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlGetGameRecord/ResGetGameRecord": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "list",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/IGameRecord"
                        }
                    }
                }
            ]
        },
        "../models/Interfaces/IGameRecord": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "match_id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "captain_id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "team_flag",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "team_res",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "create_time",
                    "type": {
                        "type": "Date"
                    }
                },
                {
                    "id": 5,
                    "name": "task_detail",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Reference",
                                    "target": "../models/Interfaces/ITaskDetail"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": null
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "is_eliminated",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "revival_status",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "can_unfreeze"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "unfreezing"
                                }
                            },
                            {
                                "id": 2,
                                "type": {
                                    "type": "Literal",
                                    "literal": "unfrozen"
                                }
                            },
                            {
                                "id": 3,
                                "type": {
                                    "type": "Literal",
                                    "literal": "expired"
                                }
                            },
                            {
                                "id": 4,
                                "type": {
                                    "type": "Literal",
                                    "literal": "cancelled"
                                }
                            },
                            {
                                "id": 5,
                                "type": {
                                    "type": "Literal",
                                    "literal": "can_revive"
                                }
                            },
                            {
                                "id": 6,
                                "type": {
                                    "type": "Literal",
                                    "literal": "revived"
                                }
                            }
                        ]
                    },
                    "optional": true
                }
            ]
        },
        "../models/Interfaces/ITaskDetail": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "matchType",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "real"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "bot"
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "taskIndex",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "duration",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "targetSwipes",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "currentSwipes",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "failReason",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "teamPower",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "finalPower",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlGetInfo/ReqGetInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlGetInfo/ResGetInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "info",
                    "type": {
                        "type": "Intersection",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Reference",
                                    "target": "../models/Interfaces/IUser"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Reference",
                                    "target": "../models/Interfaces/IPlayer"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 1,
                    "name": "gameItems",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                }
            ]
        },
        "user/PtlGetPowerRecord/ReqGetPowerRecord": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "page",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "pageSize",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlGetPowerRecord/ResGetPowerRecord": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "list",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "id",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "type",
                                    "type": {
                                        "type": "Union",
                                        "members": [
                                            {
                                                "id": 0,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "freeze"
                                                }
                                            },
                                            {
                                                "id": 1,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "reduce"
                                                }
                                            },
                                            {
                                                "id": 2,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "increase"
                                                }
                                            },
                                            {
                                                "id": 3,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "elimination"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "operationType",
                                    "type": {
                                        "type": "Union",
                                        "members": [
                                            {
                                                "id": 0,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "team_fail"
                                                }
                                            },
                                            {
                                                "id": 1,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "elimination"
                                                }
                                            },
                                            {
                                                "id": 2,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "exchange_point"
                                                }
                                            },
                                            {
                                                "id": 3,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "unfreeze"
                                                }
                                            },
                                            {
                                                "id": 4,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "revival"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "id": 3,
                                    "name": "amount",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 4,
                                    "name": "reason",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 5,
                                    "name": "time",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 6,
                                    "name": "unfreezeStatus",
                                    "type": {
                                        "type": "Union",
                                        "members": [
                                            {
                                                "id": 0,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "can_unfreeze"
                                                }
                                            },
                                            {
                                                "id": 1,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "unfreezing"
                                                }
                                            },
                                            {
                                                "id": 2,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "unfrozen"
                                                }
                                            },
                                            {
                                                "id": 3,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "expired"
                                                }
                                            },
                                            {
                                                "id": 4,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "cancelled"
                                                }
                                            },
                                            {
                                                "id": 5,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "can_revive"
                                                }
                                            },
                                            {
                                                "id": 6,
                                                "type": {
                                                    "type": "Literal",
                                                    "literal": "revived"
                                                }
                                            }
                                        ]
                                    },
                                    "optional": true
                                },
                                {
                                    "id": 7,
                                    "name": "freezeAmount",
                                    "type": {
                                        "type": "Number"
                                    },
                                    "optional": true
                                }
                            ]
                        }
                    }
                },
                {
                    "id": 1,
                    "name": "total",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "page",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "pageSize",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "user/PtlGetStatus/ReqGetStatus": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlGetStatus/ResGetStatus": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "teamId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "roomId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "taskState",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "taskIndex",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "duration",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 2,
                                "name": "targetSwipes",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 3,
                                "name": "currentSwipes",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 4,
                                "name": "remainingTime",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 5,
                                "name": "status",
                                "type": {
                                    "type": "Union",
                                    "members": [
                                        {
                                            "id": 0,
                                            "type": {
                                                "type": "Literal",
                                                "literal": "active"
                                            }
                                        },
                                        {
                                            "id": 1,
                                            "type": {
                                                "type": "Literal",
                                                "literal": "rest"
                                            }
                                        },
                                        {
                                            "id": 2,
                                            "type": {
                                                "type": "Literal",
                                                "literal": "completed"
                                            }
                                        },
                                        {
                                            "id": 3,
                                            "type": {
                                                "type": "Literal",
                                                "literal": "failed"
                                            }
                                        },
                                        {
                                            "id": 4,
                                            "type": {
                                                "type": "Literal",
                                                "literal": "eliminated"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlGetTaskMessages/ReqGetTaskMessages": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlGetTaskMessages/ResGetTaskMessages": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "list",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "user/PtlGetTaskMessages/TaskMessageDto"
                        }
                    }
                }
            ]
        },
        "user/PtlGetTaskMessages/TaskMessageDto": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "type",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "is_read",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "created_at",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "user/PtlLogin/ReqLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "account",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "user/PtlLogin/ResLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "user/PtlMarkTaskMessagesRead/ReqMarkTaskMessagesRead": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlMarkTaskMessagesRead/ResMarkTaskMessagesRead": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "user/PtlReadTaskMessage/ReqReadTaskMessage": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "ids",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                }
            ]
        },
        "user/PtlReadTaskMessage/ResReadTaskMessage": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "user/PtlSubmitFeedback/ReqSubmitFeedback": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "contact",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlSubmitFeedback/ResSubmitFeedback": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "feedbackId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "user/PtlUnfreezePowerRecord/ReqUnfreezePowerRecord": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "recordId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "user/PtlUnfreezePowerRecord/ResUnfreezePowerRecord": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "unfreezedAmount",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "newPower",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "newFreezePower",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "isdie",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "bag_data",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../models/Interfaces/EnrichedBagItem"
                        }
                    }
                }
            ]
        }
    }
};