<template>
  <div class="page attractions">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="20">
          <h2>Attractions</h2>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button
            type="primary"
            @click="refreshAttractions"
            :loading="loading"
          >
            Refresh
          </el-button>
        </el-col>
      </el-row>

      <el-table
        :data="attractions"
        style="width: 100%"
        border
        :loading="loading"
      >
        <el-table-column prop="id" label="ID" min-width="80" align="center" />
        <el-table-column
          prop="nameEn"
          label="Name (English)"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="nameTc"
          label="Name (Traditional Chinese)"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="descriptionEn"
          label="Description (English)"
          min-width="200"
          align="center"
        />
        <el-table-column
          prop="descriptionTc"
          label="Description (Traditional Chinese)"
          min-width="200"
          align="center"
        />
        <el-table-column label="Image" min-width="300" align="center">
          <template #default="scope">
            <el-image
              :src="scope.row.imageUrl"
              alt="Attraction Image"
              style="width: 250px; height: auto"
              fit="cover"
              lazy
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import SideMenu from "../components/SideMenu.vue";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

const attractions = ref([]);
const loading = ref(false);

const fetchAttractions = async () => {
  loading.value = true;
  try {
    const response = await axios.get("https://localhost:3000/api/attractions", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    attractions.value = response.data.map((attraction) => ({
      id: attraction.id,
      nameEn: attraction.nameEn || "-",
      nameTc: attraction.nameTc || "-",
      descriptionEn: attraction.descriptionEn || "-",
      descriptionTc: attraction.descriptionTc || "-",
      imageUrl: attraction.imageUrl,
      audioEn: attraction.audioEn,
      audioTc: attraction.audioTc,
    }));
  } catch (error) {
    ElMessage.error("API error: GET attractions");
  } finally {
    loading.value = false;
  }
};

const refreshAttractions = () => {
  fetchAttractions();
};

onMounted(() => {
  fetchAttractions();
});
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
