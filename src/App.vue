<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useConfigStore, useModalsStore } from './store.ts';
import Api, { ApiRespData } from './api.debug.ts';
import { ref } from "vue";
import ConfigModal from './ConfigModal.vue';
import { Row, Col } from 'ant-design-vue';
import { ControlOutlined } from '@ant-design/icons-vue';

const configStore = useConfigStore();
const config = storeToRefs(configStore);
const modalsStore = useModalsStore();

const timestr = ref("...");
const datestr = ref("...");

setInterval(() => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  timestr.value = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;

  const weekday = ["日", "一", "二", "三", "四", "五", "六"];
  const d = new Date();
  const w = weekday[d.getDay()];
  datestr.value = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${w}`;
}, 1000);

const api = new Api(configStore.api);

const schedule = ref<string[]>([]);
const timetable = ref<ApiRespData.TimeTable>([]);

api.getSchedule().then((data) => {
  schedule.value = data[2];
});
api.getTimeTable().then((data) => {
  timetable.value = data;
})

configStore.hasConfig().then(async (exists) => {
  if (exists) {
    await configStore.readConfig();
    console.log(configStore)
  } else {
    console.log("No config found, opening config modal");
    modalsStore.toggleconfig();
  }
});

</script>

<template>
  <div class="container" data-tauri-drag-region>
    <div class="box" data-tauri-drag-region>
      <p>{{ datestr }}</p>
      <p class="time">{{ timestr }}</p>
    </div>
    <div class="list">
      <div v-for="item in timetable" :key="item.name" @contextmenu.prevent="">
        <span v-if="item.type === ApiRespData.TimeTableItemType.Course" class="class-row">
          <Row style="margin-top: 10px;" align="middle">
            <Col flex="30px" align="center">
            <p class="class-id">{{ item.name }}</p>
            </Col>
            <Col flex="auto">
            <div class="class-item" :style="{ fontSize: config.ui.value.fontSize + 'px' }">
              <p>{{ schedule[item.bindId!] }}</p>
            </div>
            </Col>
          </Row>
        </span>
        <span v-else>
          <p class="class-caption">{{ item.name }}</p>
        </span>
      </div>
    </div>
    <footer class="footer">
      <Row style="margin: 10px;">
        <Col flex="50px">
        <span style="color: gray;">
          V2.0.0
        </span>
        </Col>
        <Col flex="auto" align="right" style="color: white;">
        <ControlOutlined @click="modalsStore.toggleconfig()" />
        </Col>
      </Row>
    </footer>
  </div>
  <ConfigModal />
</template>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #0f0f0f;
  background-color: rgba(0, 0, 0, 0.2);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.box {
  border-radius: 10px;
  background-color: #ffffff;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.time {
  font-size: 60px;
  font-weight: bold;
  padding: 20px;
}

.list {
  width: 100%;
}

.class-row {
  margin-top: 10px;
}

.class-caption {
  color: white;
  background: none;
  margin-top: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.class-item {
  border-radius: 5px;
  background-color: #f9f9f9;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 20px;
  font-weight: bold;
}

.class-id {
  color: white;
  background: none;
  margin-right: 10px;
  font-size: 20px;
  font-weight: bold;
}

p {
  margin: 0;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>