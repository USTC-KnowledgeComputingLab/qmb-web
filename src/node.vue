<template>
  <div class="node">
    <div v-show="showMisc">
      <div v-if="node.parent">
        <strong>Parent:</strong>
        <div class="node-parent">{{ node.parent }}</div>
      </div>
      <strong>Name:</strong>
      <div class="node-name">{{ node.name }}</div>
    </div>
    <strong>Comment:</strong>
    <input class="node-comment" v-model="node.comment" />
    <div v-if="node.date">
      <strong>Begin Time:</strong>
      <div class="node-date">{{ formattedDate }}</div>
    </div>
    <strong>Command:</strong>
    <input class="node-command" v-model="command" @keyup.enter="addChild" />
    <button
      class="node-delete-node"
      @click="deleteNode"
      v-show="node.children.length == 0 && !isRoot"
    >
      Delete Node
    </button>
    <button
      class="node-toggle-show-children"
      @click="showChildren = !showChildren"
      v-show="node.children.length != 0"
    >
      {{ showChildren ? "Hide Children" : "Show Children" }}
    </button>
    <div v-show="node.children.length > 0">
      <div v-show="showChildren" class="children" @click="clickChildren">
        <Node
          v-for="(child, index) in node.children"
          :key="index"
          @deleteNode="handleDeleteNode(index)"
          :node="child"
          :showMisc="showMisc"
          :dateTimeFormat="dateTimeFormat"
          :isRoot="false"
        />
      </div>
      <div
        v-show="!showChildren"
        class="hiddenChildren"
        @click="showChildren = true"
      >
        ...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export type NodeData = {
  parent?: string;
  name: string;
  children: NodeData[];
  comment: string;
  date?: number;
};

export default defineComponent({
  name: "Node",
  props: {
    node: {
      type: Object as PropType<NodeData>,
      required: true,
    },
    showMisc: {
      type: Boolean,
      required: true,
    },
    dateTimeFormat: {
      type: String,
      required: true,
    },
    isRoot: {
      type: Boolean,
      requred: true,
    },
  },
  data() {
    return {
      showChildren: true as boolean,
      command: "" as string,
    };
  },
  computed: {
    formattedDate() {
      if (!this.node.date) {
        return "";
      }
      return moment.unix(this.node.date).format(this.dateTimeFormat);
    },
  },
  methods: {
    addChild() {
      const newChild: NodeData = {
        parent: this.node.name,
        name: uuidv4(),
        children: [],
        comment: this.command,
        date: moment().unix(),
      };
      this.node.children.unshift(newChild);
      this.command = "";
    },
    deleteNode() {
      this.$emit("deleteNode");
    },
    handleDeleteNode(index: number) {
      this.node.children.splice(index, 1);
    },
    clickChildren(event: MouseEvent) {
      const actualTarget = event.target;
      const currentTarget = event.currentTarget;
      const borderWidth = 4;
      if (actualTarget == currentTarget && event.offsetX <= borderWidth) {
        this.showChildren = false;
      }
    },
  },
});
</script>

<style scoped>
@import "./node.css";
</style>
