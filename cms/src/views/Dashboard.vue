<template>
  <div class="page dashboard">
    <SideMenu />
    <div class="content">
      <el-row :gutter="20" align="middle">
        <el-col :span="20">
          <h2>Welcome, {{ user?.username || "-" }}!</h2>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button
            type="primary"
            @click="refreshDashboard"
            :loading="productsLoading || ordersLoading"
          >
            Refresh
          </el-button>
        </el-col>
      </el-row>
      <div class="dashboard-sections">
        <div class="section">
          <h3>Low Stock Products</h3>
          <el-table
            :data="lowStockProducts"
            style="width: 100%"
            border
            :loading="productsLoading"
          >
            <el-table-column prop="id" label="ID" width="80" align="center" />
            <el-table-column
              prop="name"
              label="Name"
              min-width="150"
              align="center"
            />
            <el-table-column
              prop="quantity"
              label="Stock"
              min-width="150"
              align="center"
            />
          </el-table>
        </div>
        <div class="section">
          <h3>Order Status Overview</h3>
          <el-table
            :data="orderStatusCounts"
            style="width: 100%"
            border
            :loading="ordersLoading"
            @row-click="goToOrders"
          >
            <el-table-column prop="status" label="Status" align="center" />
            <el-table-column prop="count" label="Count" align="center" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideMenu from "../components/SideMenu.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { user } from "../router";
import axios from "axios";
import { ElMessage } from "element-plus";
import "../style.css";

const router = useRouter();

const lowStockProducts = ref([]);
const productsLoading = ref(false);
const ordersLoading = ref(false);
const orderStatusCounts = ref([]);

const fetchProducts = async () => {
  productsLoading.value = true;
  try {
    const response = await axios.get("https://localhost:3000/api/products", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    lowStockProducts.value = response.data
      .filter((product) => product.quantity <= 10)
      .map((product) => ({
        id: product.id,
        name: product.name || "-",
        quantity: product.quantity || 0,
      }));
  } catch (error) {
    ElMessage.error("API error: GET products");
  } finally {
    productsLoading.value = false;
  }
};

const fetchOrders = async () => {
  ordersLoading.value = true;
  try {
    const response = await axios.get("https://localhost:3000/api/orders", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    const statusCountMap = response.data.reduce((acc, order) => {
      const status = order.status || "submitted";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    orderStatusCounts.value = Object.entries(statusCountMap).map(
      ([status, count]) => ({
        status,
        count,
      })
    );
  } catch (error) {
    ElMessage.error("API error: GET orders");
  } finally {
    ordersLoading.value = false;
  }
};

const goToOrders = (row) => {
  router.push(`/orders?status=${row.status}`);
};

const refreshDashboard = () => {
  fetchProducts();
  fetchOrders();
};

onMounted(() => {
  fetchProducts();
  fetchOrders();
});
</script>

<style scoped>
.dashboard-sections {
  margin-top: 20px;
}
.section {
  margin-bottom: 30px;
}
.section h3 {
  margin-bottom: 10px;
}
</style>
