<script setup>
import { Modal, Form, FormItem, Input, Button } from 'ant-design-vue';
import SettingsModal from './SettingsModal.vue';
import { ref, unref } from 'vue';
import { storeToRefs } from 'pinia';
import { useConfigStore, useModalsStore } from './store.ts';
const configStore = useConfigStore();
const modalsStore = useModalsStore();
const { config } = storeToRefs(modalsStore);
const configData = storeToRefs(configStore);

const saveConfig = async () => {
    await configStore.saveConfig();
    modalsStore.toggleconfig();
}

</script>
<template>
    <Modal title="配置课表" :open="config" :footer="null" @cancel="saveConfig">
        <Form layout="vertical">
            <FormItem label="字号">
                <Input v-model:value="configData.ui.value.fontSize" type="number" />
            </FormItem>
        </Form>
        <Button type="dashed" @click="modalsStore.settings = true">高级设置</Button>
    </Modal>
    <SettingsModal />
</template>