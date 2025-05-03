<template>
  <div class="page dashboard">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="20">
          <h2>Welcome, {{ user?.username || "-" }}!</h2>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import SideMenu from "../components/SideMenu.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { user } from "../router";
import axios from "axios";
import { ElMessage } from "element-plus";
import "../style.css";

const router = useRouter();
</script>

<style scoped>
.dashboard-sections {
  margin-top: 20px;
}
.section {
  margin-bottom: 30px;
}
.section h3 {
  margin-bottom: 10px;
}
</style>
