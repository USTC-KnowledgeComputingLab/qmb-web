<script setup lang="ts">
import Node from "./node.vue";
</script>

<template>
  <h1>qmb web</h1>
  <div class="raw">
    <button class="raw-download" @click="download">Download</button>
    <button class="raw-upload" @click="upload">Upload</button>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept=".json"
      @change="handleUpload"
    />
    <button class="raw-save" @click="save">Save</button>
    <button class="raw-load" @click="load">Load</button>
    <strong>Name:</strong>
    <input class="raw-name" v-model="saveName" @input="updateSaveName()" />
    <strong>Raw:</strong>
    <div class="raw-data">
      {{ JSON.stringify(rootNode) }}
    </div>
  </div>
  <div class="config">
    <button class="config-toggle-show-misc" @click="showMisc = !showMisc">
      {{ showMisc ? "Hide Misc" : "Show Misc" }}
    </button>
    <input class="config-date-time-format" v-model="dateTimeFormat" />
  </div>
  <div class="nodes">
    <Node
      @deleteNode="handleDeleteNode"
      :node="rootNode"
      :showMisc="showMisc"
      :dateTimeFormat="dateTimeFormat"
      :isRoot="true"
    />
  </div>
  <div v-if="message != ''" class="message">
    <p>{{ message }}</p>
    <button @click="message = ''">Close</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { NodeData } from "./node.vue";

export default defineComponent({
  name: "App",
  data() {
    return {
      saveName: "" as string,
      rootNode: {
        name: "Root",
        comment: "Empty comment",
        children: [],
      } as NodeData,
      showMisc: true as boolean,
      dateTimeFormat: "YYYY年M月D日 HH:mm:ss" as string,
      message: "" as string,
    };
  },
  methods: {
    handleDeleteNode() {},
    downloadFile(content: string, fileName: string, mimeType?: string) {
      const blob = new Blob([content], { type: mimeType ?? "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    download() {
      const toSave = JSON.stringify(this.rootNode);
      const fileName = `${this.saveName}.json`;
      this.downloadFile(toSave, fileName, "text/json");
      this.message = "Downloaded";
    },
    upload() {
      const fileInput = this.$refs.fileInput as HTMLInputElement;
      fileInput.click();
    },
    handleUpload() {
      const fileInput = this.$refs.fileInput as HTMLInputElement;
      const files = fileInput.files;
      if (!files) {
        this.message = "Upload failed";
        return;
      }
      const file = files[0];
      if (!file) {
        this.message = "Upload failed";
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const target = event.target;
        if (!target) {
          this.message = "Upload failed";
          return;
        }
        const toParse = target.result;
        if (typeof toParse != "string") {
          this.message = "Upload failed";
          return;
        }
        this.rootNode = JSON.parse(toParse);
        this.saveName = file.name.slice(0, -5);
        this.message = "Uploaded";
      };
      reader.readAsText(file);
    },
    save() {
      const toSave = JSON.stringify(this.rootNode);
      localStorage.setItem(this.saveName, toSave);
      this.message = "Saved";
    },
    load() {
      const toParse = localStorage.getItem(this.saveName);
      if (toParse) {
        this.rootNode = JSON.parse(toParse);
        this.message = "Loaded";
      } else {
        this.message = "Not found";
      }
    },
    updateSaveName() {
      window.location.hash = this.saveName;
    },
    updateHash() {
      this.saveName = window.location.hash.slice(1);
    },
  },
  mounted() {
    window.addEventListener("hashchange", this.updateHash);
    this.updateHash();
    const toParse = localStorage.getItem(this.saveName);
    if (toParse) {
      this.rootNode = JSON.parse(toParse);
    }
  },
});
</script>

<style scoped>
@import "./app.css";
</style>
