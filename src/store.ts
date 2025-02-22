import { defineStore } from 'pinia'
import { Config } from './config'
import * as fs from '@tauri-apps/plugin-fs'
import Api, { ApiRespData } from './api.debug.ts'

export const useConfigStore = defineStore('config', {
    state: (): Config => {
        return {
            ui: {
                fontSize: '28'
            },
            api: {
                classid: '0'
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
            this.schedule = (await api.getSchedule())[new Date().getDay()];
            this.timetable = await api.getTimeTable();
        }
    }
})

export const useModalsStore = defineStore('modals', {
    state: () => {
        return {
            config: false
        }
    },
    actions: {
        toggleconfig() {
            this.config = !this.config
        }
    }
})