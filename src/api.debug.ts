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

    constructor(_config: ApiConfig) {

    }

    /**
     * 获取时间表。
     * @returns 时间表。
     */
    async getTimeTable(): Promise<ApiRespData.TimeTable> {
        return new Promise((resolve, _reject) => {
            resolve([
                { name: "早读", type: ApiRespData.TimeTableItemType.Course },
                { name: "第一节", type: ApiRespData.TimeTableItemType.Course },
                { name: "第二节", type: ApiRespData.TimeTableItemType.Course },
                { name: "第三节", type: ApiRespData.TimeTableItemType.Course },
                { name: "第四节", type: ApiRespData.TimeTableItemType.Course },
                { name: "午休", type: ApiRespData.TimeTableItemType.Caption },
                { name: "第五节", type: ApiRespData.TimeTableItemType.Course },
                { name: "第六节", type: ApiRespData.TimeTableItemType.Course },
                { name: "第七节", type: ApiRespData.TimeTableItemType.Course },
                { name: "第八节", type: ApiRespData.TimeTableItemType.Course },
                { name: "自习", type: ApiRespData.TimeTableItemType.Caption }
            ])
        });
    }

    /**
     * 获取课表。
     * @returns 课表。
     */
    async getSchedule(): Promise<ApiRespData.Schedule> {
        return new Promise((resolve, _reject) => {
            resolve([
                ["语文", "数学", "英语", "物理", "化学", "生物", "历史", "地理", "政治"],
                ["数学", "英语", "物理", "化学", "生物", "历史", "地理", "政治", "语文"],
                ["英语", "物理", "化学", "生物", "历史", "地理", "政治", "语文", "数学"],
                ["物理", "化学", "生物", "历史", "地理", "政治", "语文", "数学", "英语"],
                ["化学", "生物", "历史", "地理", "政治", "语文", "数学", "英语", "物理"]
            ]);
        });
    }

    /**
     * 获取班级信息。
     * @returns 班级信息。
     */
    async getClassInfo(): Promise<ApiRespData.ClassInfo> {
        return new Promise((resolve, _reject) => {
            resolve({
                name: "明德1班",
                id: "202301",
                description: "明德至善 行稳致远"
            });
        });
    }

    /**
     * 获取软件的最新版本信息。
     * @returns 软件的最新版本信息。
     */
    static async getLatestVersion(): Promise<ApiRespData.Version> {
        return new Promise((resolve, _reject) => {
            resolve({
                version: "1.0.0",
                versionCode: 1
            });
        })
    }
}

export default Api;