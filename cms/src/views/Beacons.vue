<template>
  <div class="page beacons">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="12">
          <h2>Beacons</h2>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button
            type="primary"
            @click="openCreateDialog"
            style="margin-right: 10px"
          >
            Add Beacon
          </el-button>
          <el-button type="primary" @click="refreshBeacons" :loading="loading">
            Refresh
          </el-button>
        </el-col>
      </el-row>

      <el-table
        :data="beacons"
        style="width: 100%"
        border
        :loading="loading"
        :key="tableKey"
      >
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

      <!-- Beacon Dialog -->
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
          ref="beaconForm"
          label-width="130px"
        >
          <el-form-item label="UUID" prop="uuid">
            <el-input
              v-model="form.uuid"
              placeholder="Enter UUID"
              :disabled="isEditing"
            />
          </el-form-item>
          <el-form-item label="Description" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="Enter description"
            />
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

const beacons = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEditing = ref(false);
const dialogTitle = ref("Create Beacon");
const formLoading = ref(false);
const tableKey = ref(0);

const form = ref({
  uuid: "",
  description: "",
});

const rules = ref({
  uuid: [
    { required: true, message: "Please enter UUID", trigger: "blur" },
    {
      pattern:
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      message: "Please enter a valid UUID",
      trigger: ["blur", "change"],
    },
  ],
  description: [
    { required: true, message: "Please enter description", trigger: "blur" },
    {
      min: 5,
      message: "Description must be at least 5 characters",
      trigger: "blur",
    },
  ],
});

const beaconForm = ref(null);

const fetchBeacons = async () => {
  loading.value = true;
  try {
    const response = await axios.get("https://localhost:3000/api/beacons", {
      headers: { Authorization: localStorage.getItem("token") },
    });
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
  fetchBeacons();
};

const openCreateDialog = () => {
  isEditing.value = false;
  dialogTitle.value = "Create Beacon";
  form.value = {
    uuid: "",
    description: "",
  };
  dialogVisible.value = true;
  if (beaconForm.value) {
    beaconForm.value.clearValidate();
  }
};

const openEditDialog = (beacon) => {
  isEditing.value = true;
  dialogTitle.value = "Edit Beacon";
  form.value = {
    uuid: beacon.uuid === "-" ? "" : beacon.uuid,
    description: beacon.description === "-" ? "" : beacon.description,
  };
  dialogVisible.value = true;
  if (beaconForm.value) {
    beaconForm.value.clearValidate();
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  if (beaconForm.value) {
    beaconForm.value.resetFields();
  }
};

const submitForm = () => {
  beaconForm.value.validate(async (valid) => {
    if (valid) {
      formLoading.value = true;
      try {
        if (isEditing.value) {
          await axios.patch(
            `https://localhost:3000/api/beacons/${form.value.uuid}`,
            { description: form.value.description },
            {
              headers: { Authorization: localStorage.getItem("token") },
            }
          );
          ElMessage.success("Beacon updated successfully");
        } else {
          await axios.post("https://localhost:3000/api/beacons", form.value, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          ElMessage.success("Beacon created successfully");
        }
        dialogVisible.value = false;
        tableKey.value += 1; // Force table re-render
        await fetchBeacons(); // Refetch data to ensure updates
      } catch (error) {
        if (error.response && error.response.status === 409) {
          ElMessage.error("UUID already exists");
        } else {
          ElMessage.error(
            `API error: ${isEditing.value ? "Update" : "Create"} beacon`
          );
        }
      } finally {
        formLoading.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchBeacons();
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
.el-table__cell {
  white-space: normal;
  word-break: break-word;
}
</style>
