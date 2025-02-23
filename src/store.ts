import { defineStore } from 'pinia'
import { Config } from './config'
import * as fs from '@tauri-apps/plugin-fs'
import Api, { ApiRespData } from './api.ts'

export const useConfigStore = defineStore('config', {
    state: (): Config => {
        return {
            ui: {
                fontSize: '28'
            },
            api: {
                classid: '202301',
                baseurl: 'https://backend-cs.liulyxandy.cn'
            }
        }
    },
    actions: {
        async hasConfig() {
            return await fs.exists('config.json', {baseDir: fs.BaseDirectory.AppConfig});
        },
        async readConfig() {
            const configData = JSON.parse(await fs.readTextFile('config.json', {baseDir: fs.BaseDirectory.AppConfig}));
            this.$patch(configData);
        },
        async saveConfig() {
            if (!(await this.hasConfig())) {
                await fs.mkdir('', {baseDir: fs.BaseDirectory.AppConfig});
                await fs.create('config.json', {baseDir: fs.BaseDirectory.AppConfig});
            }
            await fs.writeTextFile('config.json', JSON.stringify(this.$state), {baseDir: fs.BaseDirectory.AppConfig});
        },
        async setConfig(state: Config) {
            this.$patch(state);
            await this.saveConfig();
        }
    }
})

export const useScheduleStore = defineStore('schedule', {
    state: () => ({
        schedule: [] as string[],
        timetable: [] as ApiRespData.TimeTable
    }),
    actions: {
        async fetchSchedule(apiConfig: Config['api']) {
            const api = new Api(apiConfig);
            const modalsStore = useModalsStore();
            if (modalsStore.dataType === 'local') {
                modalsStore.dataStatus = 'fetching';
                if (!(await fs.exists('backup.schedule.json', {baseDir: fs.BaseDirectory.AppConfig})) || !(await fs.exists('backup.timetable.json', {baseDir: fs.BaseDirectory.AppConfig}))) {
                    modalsStore.dataStatus = 'error';
                    return;
                }
                this.schedule = JSON.parse(await fs.readTextFile('backup.schedule.json', {baseDir: fs.BaseDirectory.AppConfig}));
                this.timetable = JSON.parse(await fs.readTextFile('backup.timetable.json', {baseDir: fs.BaseDirectory.AppConfig}));
                modalsStore.dataStatus = 'success';
            } else {
                this.schedule = (await api.getSchedule())[new Date().getDay()];
                this.timetable = await api.getTimeTable();
                if (!(await fs.exists('backup.schedule.json', {baseDir: fs.BaseDirectory.AppConfig}))){
                    await fs.create('backup.schedule.json', {baseDir: fs.BaseDirectory.AppConfig});
                }
                if (!(await fs.exists('backup.timetable.json', {baseDir: fs.BaseDirectory.AppConfig}))){
                    await fs.create('backup.timetable.json', {baseDir: fs.BaseDirectory.AppConfig});
                }
                await fs.writeTextFile('backup.schedule.json', JSON.stringify(this.schedule), {baseDir: fs.BaseDirectory.AppConfig});
                await fs.writeTextFile('backup.timetable.json', JSON.stringify(this.timetable), {baseDir: fs.BaseDirectory.AppConfig});
            }
        }
    }
})

export const useModalsStore = defineStore('modals', {
    state: () => {
        return {
            config: false,
            dataType: 'cloud',
            dataStatus: 'fetching',
            settings: false
        }
    },
    actions: {
        toggleconfig() {
            this.config = !this.config
        }
    }
})