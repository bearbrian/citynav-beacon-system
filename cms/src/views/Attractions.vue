<template>
  <div class="page attractions">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="12">
          <h2>Attractions</h2>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button
            type="primary"
            @click="openCreateDialog"
            style="margin-right: 10px"
          >
            Add Attraction
          </el-button>
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
        <el-table-column label="Audio (English)" min-width="200" align="center">
          <template #default="scope">
            <audio controls :src="scope.row.audioEn" style="width: 180px">
              Your browser does not support the audio element.
            </audio>
          </template>
        </el-table-column>
        <el-table-column
          label="Audio (Traditional Chinese)"
          min-width="200"
          align="center"
        >
          <template #default="scope">
            <audio controls :src="scope.row.audioTc" style="width: 180px">
              Your browser does not support the audio element.
            </audio>
          </template>
        </el-table-column>
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

      <!-- Attraction Dialog -->
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
          ref="attractionForm"
          label-width="130px"
        >
          <el-form-item label="Name (EN)" prop="nameEn">
            <el-input v-model="form.nameEn" />
          </el-form-item>
          <el-form-item label="Name (TC)" prop="nameTc">
            <el-input v-model="form.nameTc" />
          </el-form-item>
          <el-form-item label="Description (EN)" prop="descriptionEn">
            <el-input v-model="form.descriptionEn" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="Description (TC)" prop="descriptionTc">
            <el-input v-model="form.descriptionTc" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="Image URL" prop="imageUrl">
            <el-input v-model="form.imageUrl" />
          </el-form-item>
          <el-form-item label="Audio (EN)" prop="audioEn">
            <el-input v-model="form.audioEn" />
          </el-form-item>
          <el-form-item label="Audio (TC)" prop="audioTc">
            <el-input v-model="form.audioTc" />
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

const attractions = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEditing = ref(false);
const dialogTitle = ref("Create Attraction");
const formLoading = ref(false);

const form = ref({
  id: null,
  nameEn: "",
  nameTc: "",
  descriptionEn: "",
  descriptionTc: "",
  imageUrl: "",
  audioEn: "",
  audioTc: "",
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
  imageUrl: [
    { required: true, message: "Please enter image URL", trigger: "blur" },
    {
      type: "url",
      message: "Please enter a valid URL",
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
});

const attractionForm = ref(null);

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

const openCreateDialog = () => {
  isEditing.value = false;
  dialogTitle.value = "Create Attraction";
  form.value = {
    id: null,
    nameEn: "",
    nameTc: "",
    descriptionEn: "",
    descriptionTc: "",
    imageUrl: "",
    audioEn: "",
    audioTc: "",
  };
  dialogVisible.value = true;
  if (attractionForm.value) {
    attractionForm.value.clearValidate();
  }
};

const openEditDialog = (attraction) => {
  isEditing.value = true;
  dialogTitle.value = "Edit Attraction";
  form.value = { ...attraction };
  dialogVisible.value = true;
  if (attractionForm.value) {
    attractionForm.value.clearValidate();
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  if (attractionForm.value) {
    attractionForm.value.resetFields();
  }
};

const submitForm = () => {
  attractionForm.value.validate(async (valid) => {
    if (valid) {
      formLoading.value = true;
      try {
        const data = { ...form.value };
        if (isEditing.value) {
          await axios.patch(
            `https://localhost:3000/api/attractions/${form.value.id}`,
            data,
            {
              headers: { Authorization: localStorage.getItem("token") },
            }
          );
          ElMessage.success("Attraction updated successfully");
        } else {
          await axios.post("https://localhost:3000/api/attractions", data, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          ElMessage.success("Attraction created successfully");
        }
        dialogVisible.value = false;
        fetchAttractions();
      } catch (error) {
        ElMessage.error(
          `API error: ${isEditing.value ? "Update" : "Create"} attraction`
        );
      } finally {
        formLoading.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchAttractions();
});
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
