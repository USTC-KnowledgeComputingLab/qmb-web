<script setup>
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

<script>
export default {
  name: "App",
  data() {
    return {
      saveName: "",
      rootNode: {
        name: "Root",
        comment: "Empty comment",
        children: [],
      },
      showMisc: true,
      dateTimeFormat: "YYYY年M月D日 HH:mm:ss",
      message: "",
    };
  },
  methods: {
    handleDeleteNode() {},
    downloadFile(content, fileName, mimeType) {
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
      this.$refs.fileInput.click();
    },
    handleUpload() {
      const file = this.$refs.fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const toParse = e.target.result;
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
};
</script>

<style scoped>
@import "./app.css";
</style>
