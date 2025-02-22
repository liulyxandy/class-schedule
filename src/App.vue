<script setup lang="ts">
import { ref } from "vue";

const config = {
  title: "课程表"
}

const timestr = ref("...");
const datestr = ref("...");
const fontSize = ref(28);
const showFontSizePopup = ref(false);
const editingClassIndex = ref<number | null>(null);
const newClassName = ref("");

function getTodayClass(): Array<string> {
  return [];
}

const classList = ref(getTodayClass());

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

function toggleFontSizePopup() {
  showFontSizePopup.value = !showFontSizePopup.value;
}

function updateFontSize(event: Event) {
  const target = event.target as HTMLInputElement;
  fontSize.value = parseInt(target.value);
}

function startEditingClass(index: number) {
  editingClassIndex.value = index;
  newClassName.value = classList.value[index];
}

function saveClassName() {
  if (editingClassIndex.value !== null) {
    classList.value[editingClassIndex.value] = newClassName.value;
    editingClassIndex.value = null;
  }
}

</script>

<template>
  <div class="container" data-tauri-drag-region>
    <div class="header" data-tauri-drag-region @contextmenu.prevent="toggleFontSizePopup">
      <p data-tauri-drag-region>{{ config.title }}</p>
    </div>
    <div class="box">
      <p>{{ datestr }}</p>
      <p class="time">{{ timestr }}</p>
    </div>
    <div class="list">
      <div v-for="(item, id) in classList" :key="item" class="class-row" @contextmenu.prevent="startEditingClass(id)">
        <p class="class-id">{{ id + 1 }}</p>
        <div class="class-item" :style="{ fontSize: fontSize + 'px' }">
          <p v-if="editingClassIndex !== id">{{ item }}</p>
          <input v-else v-model="newClassName" @blur="saveClassName" @keyup.enter="saveClassName" />
        </div>
      </div>
    </div>
    <div v-if="showFontSizePopup" class="popup">
      <label for="font-size">字体大小: </label>
      <input id="font-size" type="number" v-model="fontSize" @input="updateFontSize" />
      <br>
      <div class="about">
        <b>作者：刘宇轩</b>
      </div>
    </div>
  </div>
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

.header {
  color: gray;
  font-size: 10px;
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
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.class-item {
  flex: 1;
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

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 1000;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.about {
  margin-top: 20px;
  font-size: 12px;
  color: gray;
}
</style>