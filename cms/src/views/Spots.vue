<template>
  <div class="page spots">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="12">
          <h2>Spots</h2>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button
            type="primary"
            @click="openCreateDialog"
            style="margin-right: 10px"
          >
            Add Spot
          </el-button>
          <el-button type="primary" @click="refreshSpots" :loading="loading">
            Refresh
          </el-button>
        </el-col>
      </el-row>

      <el-table
        :data="spots"
        style="width: 100%"
        border
        :loading="loading"
        :key="tableKey"
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
          prop="nameJp"
          label="Name (Japanese)"
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
        <el-table-column
          prop="descriptionJp"
          label="Description (Japanese)"
          min-width="200"
          align="center"
        />
        <el-table-column label="Gallery" min-width="300" align="center">
          <template #default="scope">
            <el-carousel
              v-if="scope.row.images && scope.row.images.length"
              height="150px"
              :interval="5000"
              style="width: 250px; margin: 0 auto"
              indicator-position="outside"
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
        <el-table-column label="Audio (English)" min-width="220" align="center">
          <template #default="scope">
            <audio
              controls
              :src="scope.row.audioEn"
              style="width: 200px"
              v-if="scope.row.audioEn"
            >
              Your browser does not support the audio element.
            </audio>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Audio (Traditional Chinese)"
          min-width="220"
          align="center"
        >
          <template #default="scope">
            <audio
              controls
              :src="scope.row.audioTc"
              style="width: 200px"
              v-if="scope.row.audioTc"
            >
              Your browser does not support the audio element.
            </audio>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Audio (Japanese)"
          min-width="220"
          align="center"
        >
          <template #default="scope">
            <audio
              controls
              :src="scope.row.audioJp"
              style="width: 200px"
              v-if="scope.row.audioJp"
            >
              Your browser does not support the audio element.
            </audio>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="Attraction" min-width="200" align="center">
          <template #default="scope">
            <span v-if="scope.row.attractionId !== '-'">
              {{ getAttractionLabel(scope.row.attractionId) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="beaconUuid"
          label="Beacon UUID"
          min-width="200"
          align="center"
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
        <el-table-column label="Actions" min-width="120" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="openEditDialog(scope.row)"
            >
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Spot Dialog -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="90%"
        style="max-width: 600px"
        :before-close="handleClose"
      >
        <el-form
          :model="form"
          :rules="rules"
          ref="spotForm"
          label-width="130px"
        >
          <el-form-item label="Name (EN)" prop="nameEn">
            <el-input v-model="form.nameEn" />
          </el-form-item>
          <el-form-item label="Name (TC)" prop="nameTc">
            <el-input v-model="form.nameTc" />
          </el-form-item>
          <el-form-item label="Name (JP)" prop="nameJp">
            <el-input v-model="form.nameJp" />
          </el-form-item>
          <el-form-item label="Description (EN)" prop="descriptionEn">
            <el-input v-model="form.descriptionEn" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="Description (TC)" prop="descriptionTc">
            <el-input v-model="form.descriptionTc" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="Description (JP)" prop="descriptionJp">
            <el-input v-model="form.descriptionJp" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="Gallery">
            <div
              v-for="(image, index) in form.images"
              :key="index"
              class="image-input"
            >
              <el-input
                v-model="form.images[index]"
                placeholder="Enter image URL"
                style="width: calc(100% - 80px); margin-right: 10px"
              />
              <el-button
                type="danger"
                size="small"
                @click="removeImage(index)"
                style="width: 70px"
              >
                Remove
              </el-button>
            </div>
            <el-button
              type="primary"
              size="small"
              @click="addImage"
              style="margin-top: 10px; width: 100px"
              class="add-button"
            >
              Add
            </el-button>
          </el-form-item>
          <el-form-item label="Audio (EN)" prop="audioEn">
            <el-input v-model="form.audioEn" />
          </el-form-item>
          <el-form-item label="Audio (TC)" prop="audioTc">
            <el-input v-model="form.audioTc" />
          </el-form-item>
          <el-form-item label="Audio (JP)" prop="audioJp">
            <el-input v-model="form.audioJp" />
          </el-form-item>
          <el-form-item label="Attraction" prop="attractionId">
            <el-select
              v-model="form.attractionId"
              placeholder="Select Attraction"
              style="width: 100%"
            >
              <el-option
                v-for="attraction in attractions"
                :key="attraction.id"
                :label="`${attraction.id} - ${attraction.nameEn}`"
                :value="attraction.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Beacon UUID" prop="beaconUuid">
            <el-select
              v-model="form.beaconUuid"
              placeholder="Select Beacon UUID"
              style="width: 100%"
            >
              <el-option
                v-for="beacon in beacons"
                :key="beacon.uuid"
                :label="beacon.uuid"
                :value="beacon.uuid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Beacon Major" prop="beaconMajor">
            <el-input v-model.number="form.beaconMajor" type="number" />
          </el-form-item>
          <el-form-item label="Beacon Minor" prop="beaconMinor">
            <el-input v-model.number="form.beaconMinor" type="number" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">Cancel</el-button>
            <el-button
              type="primary"
              @click="submitForm"
              :loading="formLoading"
            >
              {{ isEditing ? "Update" : "Create" }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import SideMenu from "../components/SideMenu.vue";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

const spots = ref([]);
const attractions = ref([]);
const beacons = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEditing = ref(false);
const dialogTitle = ref("Create Spot");
const formLoading = ref(false);
const tableKey = ref(0);

const form = ref({
  id: null,
  nameEn: "",
  nameTc: "",
  nameJp: "",
  descriptionEn: "",
  descriptionTc: "",
  descriptionJp: "",
  images: [],
  audioEn: "",
  audioTc: "",
  audioJp: "",
  attractionId: null,
  beaconUuid: "",
  beaconMajor: null,
  beaconMinor: null,
});

const rules = ref({
  nameEn: [
    { required: true, message: "Please enter English name", trigger: "blur" },
    { min: 2, message: "Name must be at least 2 characters", trigger: "blur" },
  ],
  nameTc: [
    {
      required: true,
      message: "Please enter Traditional Chinese name",
      trigger: "blur",
    },
    { min: 2, message: "Name must be at least 2 characters", trigger: "blur" },
  ],
  nameJp: [
    {
      required: true,
      message: "Please enter Japanese name",
      trigger: "blur",
    },
    { min: 2, message: "Name must be at least 2 characters", trigger: "blur" },
  ],
  descriptionEn: [
    {
      required: true,
      message: "Please enter English description",
      trigger: "blur",
    },
    {
      min: 10,
      message: "Description must be at least 10 characters",
      trigger: "blur",
    },
  ],
  descriptionTc: [
    {
      required: true,
      message: "Please enter Traditional Chinese description",
      trigger: "blur",
    },
    {
      min: 10,
      message: "Description must be at least 10 characters",
      trigger: "blur",
    },
  ],
  descriptionJp: [
    {
      required: true,
      message: "Please enter Japanese description",
      trigger: "blur",
    },
    {
      min: 10,
      message: "Description must be at least 10 characters",
      trigger: "blur",
    },
  ],
  attractionId: [
    {
      required: true,
      message: "Please select an Attraction",
      trigger: "change",
    },
  ],
  beaconUuid: [
    {
      required: true,
      message: "Please select a Beacon UUID",
      trigger: "change",
    },
  ],
  beaconMajor: [
    { required: true, message: "Please enter Beacon Major", trigger: "blur" },
    {
      type: "number",
      message: "Must be a number",
      trigger: ["blur", "change"],
    },
    {
      validator: (rule, value, callback) => {
        if (value < 0) {
          callback(new Error("Beacon Major cannot be negative"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  beaconMinor: [
    { required: true, message: "Please enter Beacon Minor", trigger: "blur" },
    {
      type: "number",
      message: "Must be a number",
      trigger: ["blur", "change"],
    },
    {
      validator: (rule, value, callback) => {
        if (value < 0) {
          callback(new Error("Beacon Minor cannot be negative"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  audioEn: [
    {
      required: true,
      message: "Please enter English audio URL",
      trigger: "blur",
    },
    {
      type: "url",
      message: "Please enter a valid URL",
      trigger: ["blur", "change"],
    },
  ],
  audioTc: [
    {
      required: true,
      message: "Please enter Traditional Chinese audio URL",
      trigger: "blur",
    },
    {
      type: "url",
      message: "Please enter a valid URL",
      trigger: ["blur", "change"],
    },
  ],
  audioJp: [
    {
      required: true,
      message: "Please enter Japanese audio URL",
      trigger: "blur",
    },
    {
      type: "url",
      message: "Please enter a valid URL",
      trigger: ["blur", "change"],
    },
  ],
});

const spotForm = ref(null);

const fetchAttractions = async () => {
  try {
    const response = await axios.get(
      "https://50.16.81.205:3000/api/attractions",
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    attractions.value = response.data;
  } catch (error) {
    ElMessage.error("API error: GET attractions");
  }
};

const fetchBeacons = async () => {
  try {
    const response = await axios.get("https://50.16.81.205:3000/api/beacons", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    beacons.value = response.data;
  } catch (error) {
    ElMessage.error("API error: GET beacons");
  }
};

const getAttractionLabel = (attractionId) => {
  const attraction = attractions.value.find(
    (a) => a.id === Number(attractionId)
  );
  return attraction ? `${attraction.id} - ${attraction.nameEn}` : attractionId;
};

const addImage = () => {
  form.value.images.push("");
};

const removeImage = (index) => {
  form.value.images.splice(index, 1);
};

const fetchSpots = async () => {
  loading.value = true;
  try {
    const response = await axios.get("https://50.16.81.205:3000/api/spots", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    spots.value = response.data.data.map((spot) => ({
      id: spot.id,
      nameEn: spot.nameEn || "-",
      nameTc: spot.nameTc || "-",
      nameJp: spot.nameJp || "-",
      descriptionEn: spot.descriptionEn || "-",
      descriptionTc: spot.descriptionTc || "-",
      descriptionJp: spot.descriptionJp || "-",
      attractionId: spot.attractionId || "-",
      beaconUuid: spot.beaconUuid || "-",
      beaconMajor: spot.beaconMajor || "-",
      beaconMinor: spot.beaconMinor || "-",
      audioEn: spot.audioEn || "",
      audioTc: spot.audioTc || "",
      audioJp: spot.audioJp || "",
      images: spot.images || [],
    }));
  } catch (error) {
    ElMessage.error("API error: GET spots");
  } finally {
    loading.value = false;
  }
};

const refreshSpots = async () => {
  await fetchSpots();
};

const openCreateDialog = async () => {
  isEditing.value = false;
  dialogTitle.value = "Create Spot";
  form.value = {
    id: null,
    nameEn: "",
    nameTc: "",
    nameJp: "",
    descriptionEn: "",
    descriptionTc: "",
    descriptionJp: "",
    images: [],
    audioEn: "",
    audioTc: "",
    audioJp: "",
    attractionId: null,
    beaconUuid: "",
    beaconMajor: null,
    beaconMinor: null,
  };
  await Promise.all([fetchAttractions(), fetchBeacons()]);
  dialogVisible.value = true;
  if (spotForm.value) {
    spotForm.value.clearValidate();
  }
};

const openEditDialog = async (spot) => {
  isEditing.value = true;
  dialogTitle.value = "Edit Spot";
  form.value = {
    id: spot.id,
    nameEn: spot.nameEn === "-" ? "" : spot.nameEn,
    nameTc: spot.nameTc === "-" ? "" : spot.nameTc,
    nameJp: spot.nameJp === "-" ? "" : spot.nameJp,
    descriptionEn: spot.descriptionEn === "-" ? "" : spot.descriptionEn,
    descriptionTc: spot.descriptionTc === "-" ? "" : spot.descriptionTc,
    descriptionJp: spot.descriptionJp === "-" ? "" : spot.descriptionJp,
    images: spot.images ? [...spot.images] : [],
    audioEn: spot.audioEn || "",
    audioTc: spot.audioTc || "",
    audioJp: spot.audioJp || "",
    attractionId: spot.attractionId === "-" ? null : Number(spot.attractionId),
    beaconUuid: spot.beaconUuid === "-" ? "" : spot.beaconUuid,
    beaconMajor: spot.beaconMajor === "-" ? null : Number(spot.beaconMajor),
    beaconMinor: spot.beaconMinor === "-" ? null : Number(spot.beaconMinor),
  };
  await Promise.all([fetchAttractions(), fetchBeacons()]);
  dialogVisible.value = true;
  if (spotForm.value) {
    spotForm.value.clearValidate();
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  if (spotForm.value) {
    spotForm.value.resetFields();
  }
};

const submitForm = () => {
  spotForm.value.validate(async (valid) => {
    if (valid) {
      formLoading.value = true;
      try {
        const data = {
          ...form.value,
          images: form.value.images.filter((url) => url.trim() !== ""),
        };
        if (isEditing.value) {
          await axios.patch(
            `https://50.16.81.205:3000/api/spots/${form.value.id}`,
            data,
            {
              headers: { Authorization: localStorage.getItem("token") },
            }
          );
          ElMessage.success("Spot updated successfully");
        } else {
          await axios.post("https://50.16.81.205:3000/api/spots", data, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          ElMessage.success("Spot created successfully");
        }
        dialogVisible.value = false;
        tableKey.value += 1;
        await fetchSpots();
      } catch (error) {
        ElMessage.error(
          `API error: ${isEditing.value ? "Update" : "Create"} spot`
        );
      } finally {
        formLoading.value = false;
      }
    }
  });
};

onMounted(async () => {
  await Promise.all([fetchSpots(), fetchAttractions()]);
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.el-table__cell {
  white-space: normal;
  word-break: break-word;
}
.image-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}
.image-input .el-input {
  flex-grow: 1;
  margin-right: 10px;
}
.image-input .el-button {
  flex-shrink: 0;
}
.add-button {
  margin-top: 10px;
  width: 100px;
}
:deep(.el-carousel__indicator button) {
  background-color: #dcdcdc;
}
:deep(.el-carousel__indicator.is-active button) {
  background-color: #409eff;
}
:deep(.el-carousel__arrow) {
  background-color: #409eff;
}
:deep(.el-carousel__arrow:hover) {
  background-color: #66b1ff;
}
</style>
