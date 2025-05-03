<template>
  <el-form
    ref="loginForm"
    :model="form"
    :rules="rules"
    @submit.prevent="submitLogin"
    class="login-form"
  >
    <el-form-item prop="username" size="large">
      <el-input
        v-model="form.username"
        placeholder="Username"
        :prefix-icon="User"
        clearable
      />
    </el-form-item>
    <el-form-item prop="password" size="large">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Password"
        :prefix-icon="Lock"
        show-password
        clearable
      />
    </el-form-item>
    <el-button
      type="primary"
      native-type="submit"
      size="large"
      :loading="loading"
    >
      Login
    </el-button>
  </el-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElForm, ElInput, ElButton } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";

const form = reactive({
  username: "admin",
  password: "admin",
});

const loginForm = ref(null);
const loading = ref(false);

const rules = {
  username: [
    { required: true, message: "Username is required", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
  ],
};

const submitLogin = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      emit("login", { username: form.username, password: form.password });
      setTimeout(() => (loading.value = false), 1000);
    }
  });
};

const emit = defineEmits(["login"]);
</script>

<style scoped>
.login-form {
  width: 80%;
  max-width: 300px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-form-item {
  margin-bottom: 24px;
  line-height: 24px;
}

.el-button {
  width: 100%;
}
</style>
