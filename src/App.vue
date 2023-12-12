<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import baseURL from "@/service/base";
import api from "@/api";
import formatTime from "@/utils/formatTime";

const token = localStorage.getItem("appToken");
const tableData = ref([]);
const getAppList = () => {
  api.getAppList().then((res) => {
    tableData.value = res.data.map((item) => ({
      ...item,
      created_at: formatTime(item.created_at),
    }));
  });
  console.log(tableData);
};
getAppList();

const beforeUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 50) {
    ElMessage.error("文件大小不能超过 50MB!");
    return false;
  }
  return true;
};
const handleSuccess = (response, uploadFile) => {
  if (response.status) {
    formData.download_link = response.data.url;
    ElMessage.success(response.msg);
  } else {
    ElMessage.error(response.msg);
  }
};
const handleError = (error, uploadFile, uploadFiles) => {
  ElMessage.error(error.message);
};

const dialogVisible = ref(false);
const ruleFormRef = ref();
const formData = reactive({
  app_name: "",
  version_number: "",
  download_link: "",
  release_notes: "",
});
const rules = {
  app_name: {
    required: true,
    message: "请输入应用名称",
    trigger: "blur",
  },
  version_number: {
    required: true,
    message: "请输入版本号",
    trigger: "blur",
  },
  download_link: {
    required: true,
    message: "请上传apk",
    trigger: "blur",
  },
  release_notes: {
    required: true,
    message: "请输入更新说明",
    trigger: "blur",
  },
};
const submit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      api.addAppVersion(formData).then((res) => {
        if (res.status) {
          dialogVisible.value = false;
          formEl.resetFields();
          getAppList();
        }
      });
    }
  });
};
</script>

<template>
  <div class="main">
    <el-button type="primary" class="add-btn" @click="dialogVisible = true"
      >添加</el-button
    >
    <el-table :data="tableData" stripe style="width: 100%" size="small">
      <el-table-column prop="app_name" label="应用名称" width="180" />
      <el-table-column prop="version_number" label="版本号" width="100" />
      <el-table-column prop="release_notes" label="更新说明" />
      <el-table-column prop="download_link" label="下载链接">
        <template #default="scope">
          <a :href="scope.row.download_link" target="_blank">
            {{ scope.row.download_link }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" title="添加版本信息" width="40%">
    <el-form
      :model="formData"
      ref="ruleFormRef"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="应用名称" prop="app_name">
        <el-input v-model="formData.app_name" />
      </el-form-item>
      <el-form-item label="版本号" prop="version_number">
        <el-input v-model="formData.version_number" />
      </el-form-item>
      <el-form-item label="下载链接" prop="download_link">
        <el-upload
          style="width: 100%"
          drag
          :action="baseURL + 'uploadAPK'"
          :limit="1"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          name="file"
          :headers="{
            Authorization: token,
          }"
        >
          <svg
            t="1702285281864"
            class="icon"
            viewBox="0 0 1024 1024"
            version_number="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4372"
            width="128"
            height="128"
          >
            <path
              d="M565.333333 779.914667l51.445334-54.912a31.733333 31.733333 0 0 1 45.226666-1.226667 32.64 32.64 0 0 1 1.216 45.770667l-97.418666 104a37.034667 37.034667 0 0 1-52.821334 1.397333l-108.362666-104.202667a32.64 32.64 0 0 1-1.152-45.770666 31.733333 31.733333 0 0 1 45.248-1.173334L501.333333 774.421333V512.074667c0-17.877333 14.325333-32.373333 32-32.373334s32 14.506667 32 32.373334v267.84zM512 138.666667c123.018667 0 228.213333 86.709333 259.424 206.88C864.298667 347.146667 938.666667 426.090667 938.666667 522.688c0 97.6-75.914667 177.173333-170.133334 177.173333-17.674667 0-32-14.496-32-32.373333 0-17.877333 14.325333-32.373333 32-32.373333 58.357333 0 106.133333-50.08 106.133334-112.426667 0-62.336-47.776-112.416-106.133334-112.416-5.856 0-11.626667 0.501333-17.301333 1.482667-17.621333 3.050667-34.304-9.098667-37.024-26.986667C698.346667 280.693333 612.714667 203.424 512 203.424c-73.834667 0-140.928 41.536-177.376 107.861333a31.914667 31.914667 0 0 1-30.122667 16.576 140.373333 140.373333 0 0 0-9.568-0.32c-80.149333 0-145.6 68.586667-145.6 153.781334 0 85.184 65.450667 153.792 145.6 153.792 17.674667 0 32 14.496 32 32.373333 0 17.877333-14.325333 32.373333-32 32.373333C178.912 699.861333 85.333333 601.770667 85.333333 481.322667c0-118.314667 90.293333-215.061333 203.456-218.453334C338.090667 186.24 421.013333 138.666667 512 138.666667z"
              fill="#000000"
              p-id="4373"
            ></path>
          </svg>
          <div class="el-upload__text">
            拖动文件到此处或者 <em> 点击上传</em>
          </div>
        </el-upload>
        <div style="word-break: break-all">{{ formData.download_link }}</div>
      </el-form-item>
      <el-form-item label="更新说明" prop="release_notes">
        <el-input :rows="3" type="textarea" v-model="formData.release_notes" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.main {
  padding: 30px;
}
.add-btn {
  margin-bottom: 20px;
  float: right;
}
</style>
