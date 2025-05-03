<template>
  <div class="page beacons">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="12">
          <h2>Beacons</h2>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="uuidFilter"
            placeholder="Filter by UUID"
            clearable
            @input="fetchBeacons"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="primary" @click="refreshBeacons" :loading="loading">
            Refresh
          </el-button>
        </el-col>
      </el-row>

      <el-table :data="beacons" style="width: 100%" border :loading="loading">
        <el-table-column
          prop="uuid"
          label="UUID"
          min-width="300"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="description"
          label="Description"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import SideMenu from "../components/SideMenu.vue";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

const beacons = ref([]);
const loading = ref(false);
const uuidFilter = ref("");

const fetchBeacons = async () => {
  loading.value = true;
  try {
    const response = await axios.get("https://localhost:3000/api/beacons", {
      headers: { Authorization: localStorage.getItem("token") },
      params: { uuid: uuidFilter.value || undefined },
    });
    console.log("response", response);
    beacons.value = response.data.map((beacon) => ({
      uuid: beacon.uuid || "-",
      description: beacon.description || "-",
    }));
  } catch (error) {
    ElMessage.error("API error: GET beacons");
  } finally {
    loading.value = false;
  }
};

const refreshBeacons = () => {
  uuidFilter.value = "";
  fetchBeacons();
};

onMounted(() => {
  fetchBeacons();
});
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
.el-input {
  vertical-align: middle;
}
</style>
