import axios, { AxiosInstance } from "axios";

export interface ApiConfig {
    /**
     * 课表服务器的根节点。
     * @default "https://backend-cs.liulyxandy.cn"
     */
    baseurl?: string,
    /**
     * 班级ID。
     * @example "202301"
     */
    classid: string
}

interface ApiResponse<T = any> {
    code: number,
    msg: string,
    data: T
}

export namespace ApiRespData {
    export interface Version {
        /**
         * 课表服务器的版本号。
         */
        version: string,
        /**
         * 课表服务器的内部版本号。
         */
        versionCode: number
    }
    export enum TimeTableItemType {
        Course = "course",
        Caption = "caption"
    }
    export interface TimeTableItem {
        /**
         * 显示名称。
         */
        name: string,
        /**
         * 类型。
         */
        type: TimeTableItemType
    }
    export type TimeTable = Array<TimeTableItem>;
    export type Schedule = Array<Array<string>>;
    export interface ClassInfo {
        /**
         * 班级名称。
         */
        name: string,
        /**
         * 班级ID。
         */
        id: string,
        /**
         * 班级描述。
         */
        description: string
    }
}


class Api {
    /**
     * 课表服务器的根节点。
     * @default "https://backend-cs.liulyxandy.cn"
     */
    private baseurl: string;
    /**
     * 班级ID。
     * @example "202301"
     */
    private classid: string;
    /**
     * axios实例。
     */
    private request: AxiosInstance;

    constructor(config: ApiConfig) {
        this.baseurl = config.baseurl ?? "https://backend-cs.liulyxandy.cn";
        this.classid = config.classid;
        this.request = axios.create({
            baseURL: this.baseurl + "/class/" + this.classid
        });
    }

    /**
     * 获取时间表。
     * @returns 时间表。
     */
    async getTimeTable(): Promise<ApiRespData.TimeTable> {
        return new Promise((resolve, reject) => {
            this.request.get<ApiResponse<ApiRespData.TimeTable>>("/timetable")
                .then(res => {
                    resolve(res.data.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * 获取课表。
     * @returns 课表。
     */
    async getSchedule(): Promise<ApiRespData.Schedule> {
        return new Promise((resolve, reject) => {
            this.request.get<ApiResponse<ApiRespData.Schedule>>("/schedule")
                .then(res => {
                    resolve(res.data.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * 获取班级信息。
     * @returns 班级信息。
     */
    async getClassInfo(): Promise<ApiRespData.ClassInfo> {
        return new Promise((resolve, reject) => {
            this.request.get<ApiResponse<ApiRespData.ClassInfo>>("/")
                .then(res => {
                    resolve(res.data.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * 获取软件的最新版本信息。
     * @returns 软件的最新版本信息。
     */
    static async getLatestVersion(): Promise<ApiRespData.Version> {
        return new Promise((resolve, reject) => {
            axios.get<ApiResponse<ApiRespData.Version>>("https://backend-cs.liulyxandy.cn/version")
                .then(res => {
                    resolve(res.data.data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
}

export default Api;