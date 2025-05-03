<template>
  <div class="login-page">
    <h2>CityNav Beacon System</h2>
    <LoginForm @login="handleLogin" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { isAuthenticated, user } from "../router";
import LoginForm from "../components/LoginForm.vue";

const router = useRouter();

const handleLogin = async (credentials) => {
  try {
    const response = await fetch("https://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    isAuthenticated.value = true;
    user.value = data.user;
    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  } catch (error) {
    alert(error.message || "Login failed, please check username or password");
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f7fa;
}

h2 {
  margin-bottom: 20px;
  color: #303133;
}
</style>
