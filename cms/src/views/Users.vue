<template>
  <div class="page users">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="20">
          <h2>Users</h2>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="primary" @click="refreshUsers" :loading="loading">
            Refresh
          </el-button>
        </el-col>
      </el-row>

      <el-table :data="users" style="width: 100%" border :loading="loading">
        <el-table-column prop="id" label="ID" min-width="200" align="center" />
        <el-table-column
          prop="username"
          label="Username"
          min-width="300"
          align="center"
        />
        <el-table-column
          prop="isAdmin"
          label="Is Admin"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <el-checkbox
              v-model="userAdminStatus[scope.row.username]"
              :disabled="
                !isAdmin || scope.row.username === currentUser.username
              "
            />
          </template>
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 20px">
        <el-col class="update-button">
          <el-button
            type="primary"
            size="large"
            @click="confirmUpdate"
            :disabled="!isAdmin || submitting || !hasChanges"
            :loading="submitting"
            style="width: 100%"
          >
            Update Admin Status
          </el-button>
        </el-col>
      </el-row>

      <el-dialog
        v-model="showConfirmDialog"
        title="Confirm Admin Status Updates"
        width="30%"
        center
      >
        <p>Are you sure you want to update the following admin statuses?</p>
        <ul v-if="changedUsers.length > 0">
          <li v-for="item in changedUsers" :key="item.username">
            {{ item.username }}: {{ item.isAdmin ? "Grant" : "Revoke" }} Admin
          </li>
        </ul>
        <template #footer>
          <el-button @click="showConfirmDialog = false">Cancel</el-button>
          <el-button type="primary" @click="submitUpdate" :loading="submitting">
            Confirm
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import SideMenu from "../components/SideMenu.vue";
import { ref, onMounted, computed } from "vue";
import { user } from "../router";
import { ElMessage } from "element-plus";
import axios from "axios";
import "../style.css";

const users = ref([]);
const loading = ref(false);
const submitting = ref(false);
const showConfirmDialog = ref(false);
const userAdminStatus = ref({});
const isAdmin = ref(user.value?.is_admin || false);
const currentUser = ref(user.value || { username: "" });

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get("https://localhost:3000/api/users", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    users.value = response.data.map((user) => ({
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin,
    }));

    users.value.forEach((user) => {
      userAdminStatus.value[user.username] = user.isAdmin;
    });
  } catch (error) {
    ElMessage.error("API: GET users");
  } finally {
    loading.value = false;
  }
};

const changedUsers = computed(() => {
  return users.value
    .filter((user) => userAdminStatus.value[user.username] !== user.isAdmin)
    .map((user) => ({
      username: user.username,
      isAdmin: userAdminStatus.value[user.username],
    }));
});

const hasChanges = computed(() => changedUsers.value.length > 0);

const confirmUpdate = () => {
  if (!hasChanges.value) {
    ElMessage.warning("No changes to update");
    return;
  }
  showConfirmDialog.value = true;
};

const submitUpdate = async () => {
  showConfirmDialog.value = false;
  submitting.value = true;
  try {
    const updates = changedUsers.value;
    await Promise.all(
      updates.map((update) =>
        axios.patch(
          `https://localhost:3000/api/users/${update.username}`,
          { is_admin: update.isAdmin },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        )
      )
    );
    ElMessage.success("Admin statuses updated successfully");
    await fetchUsers();
  } catch (error) {
    ElMessage.error("API: PATCH users");
    await fetchUsers();
  } finally {
    submitting.value = false;
  }
};

const refreshUsers = () => {
  fetchUsers();
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.el-table {
  width: 100%;
}
.update-button {
  text-align: center;
}
</style>
