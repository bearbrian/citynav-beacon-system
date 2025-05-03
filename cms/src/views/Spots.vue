<template>
  <div class="page spots">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="20">
          <h2>Spots</h2>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="primary" @click="refreshSpots" :loading="loading">
            Refresh
          </el-button>
        </el-col>
      </el-row>

      <el-table :data="spots" style="width: 100%" border :loading="loading">
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
          show-overflow-tooltip
        />
        <el-table-column
          prop="descriptionTc"
          label="Description (Traditional Chinese)"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="attractionId"
          label="Attraction ID"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="beaconUuid"
          label="Beacon UUID"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="beaconMajor"
          label="Beacon Major"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="beaconMinor"
          label="Beacon Minor"
          min-width="100"
          align="center"
        />
        <el-table-column label="Audio (English)" min-width="150" align="center">
          <template #default="scope">
            <audio
              controls
              :src="scope.row.audioEn"
              style="width: 120px"
              v-if="scope.row.audioEn"
            >
              Your browser does not support the audio element.
            </audio>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Audio (Traditional Chinese)"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <audio
              controls
              :src="scope.row.audioTc"
              style="width: 120px"
              v-if="scope.row.audioTc"
            >
              Your browser does not support the audio element.
            </audio>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="Gallery" min-width="300" align="center">
          <template #default="scope">
            <el-carousel
              v-if="scope.row.images && scope.row.images.length"
              height="150px"
              :interval="5000"
              style="width: 250px; margin: 0 auto"
            >
              <el-carousel-item
                v-for="(image, index) in scope.row.images"
                :key="index"
              >
                <el-image
                  :src="image"
                  alt="Spot Image"
                  style="width: 100%; height: 100%"
                  fit="cover"
                  lazy
                  @error="() => (image = 'https://via.placeholder.com/250')"
                />
              </el-carousel-item>
            </el-carousel>
            <el-image
              v-else
              src="https://via.placeholder.com/250"
              alt="No Images"
              style="width: 250px; height: auto"
              fit="cover"
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

const spots = ref([]);
const loading = ref(false);

const fetchSpots = async () => {
  loading.value = true;
  try {
    const response = await axios.get("https://localhost:3000/api/spots", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    spots.value = response.data.data.map((spot) => ({
      id: spot.id,
      nameEn: spot.nameEn || "-",
      nameTc: spot.nameTc || "-",
      descriptionEn: spot.descriptionEn || "-",
      descriptionTc: spot.descriptionTc || "-",
      attractionId: spot.attractionId || "-",
      beaconUuid: spot.beaconUuid || "-",
      beaconMajor: spot.beaconMajor || "-",
      beaconMinor: spot.beaconMinor || "-",
      audioEn: spot.audioEn || "",
      audioTc: spot.audioTc || "",
      images: spot.images || [],
    }));
  } catch (error) {
    ElMessage.error("API error: GET spots");
  } finally {
    loading.value = false;
  }
};

const refreshSpots = () => {
  fetchSpots();
};

onMounted(() => {
  fetchSpots();
});
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
.el-carousel {
  border-radius: 4px;
  overflow: hidden;
}
audio {
  vertical-align: middle;
}
</style>
