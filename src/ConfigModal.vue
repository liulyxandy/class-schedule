<script setup>
import { Modal, Form, FormItem, Input, Button } from 'ant-design-vue';
import { ref, unref } from 'vue';
import { storeToRefs } from 'pinia';
import { useConfigStore, useModalsStore } from './store.ts';
const configStore = useConfigStore();
const modalsStore = useModalsStore();
const { config } = storeToRefs(modalsStore);

const configData = ref({
    api: configStore.api,
    ui: configStore.ui
})

const saveConfig = () => {
    configStore.setConfig(unref(configData));
    modalsStore.toggleconfig();
}

</script>
<template>
    <Modal title="配置课表" :open="config" :footer="null" @cancel="saveConfig">
        <Form layout="vertical">
            <FormItem label="API 根节点">
                <Input v-model:value="configData.api.baseurl" />
            </FormItem>
            <FormItem label="班级ID">
                <Input v-model:value="configData.api.classid" />
            </FormItem>
            <FormItem label="字号">
                <Input v-model:value="configData.ui.fontSize" type="number" />
            </FormItem>
        </Form>
    </Modal>
</template>