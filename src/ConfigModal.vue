<script setup>
import { Modal, Form, FormItem, Input, Button, Switch } from 'ant-design-vue';
import SettingsModal from './SettingsModal.vue';
import { ref, unref } from 'vue';
import { storeToRefs } from 'pinia';
import { useConfigStore, useModalsStore } from './store.ts';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
const configStore = useConfigStore();
const modalsStore = useModalsStore();
const { config } = storeToRefs(modalsStore);
const configData = storeToRefs(configStore);
const autostart = ref(false);
const saveConfig = async () => {
    await configStore.saveConfig();
    if (autostart.value) {
        await enable();
    }
    else {
        await disable();
    }
    modalsStore.toggleconfig();
}

isEnabled().then((enabled) => {
    autostart.value = enabled;
})

</script>
<template>
    <Modal title="配置课表" :open="config" :footer="null" @cancel="saveConfig">
        <Form layout="vertical">
            <FormItem label="字号">
                <Input v-model:value="configData.ui.value.fontSize" type="number" />
            </FormItem>
            <FormItem label="自动启动">
                <Switch v-model:checked="autostart" />
            </FormItem>
        </Form>
        <Button type="dashed" @click="modalsStore.settings = true">高级设置</Button>
    </Modal>
    <SettingsModal />
</template>