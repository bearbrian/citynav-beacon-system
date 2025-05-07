<template>
  <div class="side-menu">
    <nav>
      <ul>
        <li>
          <router-link to="/dashboard">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/users">Users</router-link>
        </li>
        <li>
          <router-link to="/attractions">Attractions</router-link>
        </li>
        <li>
          <router-link to="/spots">Spots</router-link>
        </li>
        <li>
          <router-link to="/beacons">Beacons</router-link>
        </li>
        <li><button @click="logout">Logout</button></li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { isAuthenticated } from "../router";

const router = useRouter();

const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await fetch("https://50.16.81.205:3000/api/logout", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Logout failed");
  } catch (error) {
    alert(error.message || "Logout failed");
  } finally {
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    router.push("/index.html");
  }
};
</script>

<style scoped>
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #333;
  color: white;
  transition: left 0.3s ease;
}
.toggle-btn {
  position: absolute;
  top: 10px;
  right: -50px;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
}
nav {
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 20px 0;
}
a {
  color: white;
  text-decoration: none;
}
a.router-link-active {
  font-weight: bold;
}
button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
