import * as fs from '@tauri-apps/plugin-fs';
import { ApiConfig } from './api';

interface Config {
    api: ApiConfig,
    ui: {
        fontSize: number
    }
}

export default {
    hasConfig: async () => {
        return await fs.exists('config.json', {baseDir: fs.BaseDirectory.AppConfig});
    },
    readConfig: async () => {
        return (JSON.parse(await fs.readTextFile('config.json', {baseDir: fs.BaseDirectory.AppConfig}))) as Config;
    },
    writeConfig: async (config: Config) => {
        await fs.writeTextFile('config.json', JSON.stringify(config), {baseDir: fs.BaseDirectory.AppConfig});
    }
}