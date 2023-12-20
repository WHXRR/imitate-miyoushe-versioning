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
};
getAppList();
const getLatestVersion = () => {
  api.getLatestVersion().then();
};
getLatestVersion();

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

const deleteApp = (id) => {
  api.delAppVersion({ id }).then((res) => {
    if (res.status) {
      getAppList();
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
      <el-table-column label="#" width="50">
        <template #default="scope">
          <div style="cursor: pointer" @click="deleteApp(scope.row.id)">
            <svg
              t="1703052881845"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7064"
              width="30"
              height="30"
            >
              <path
                d="M643.657143 253.910204H380.342857c-27.167347 0-49.632653-22.465306-49.632653-49.632653v-39.706122c0-27.167347 22.465306-49.632653 49.632653-49.632653h263.314286c27.167347 0 49.632653 22.465306 49.632653 49.632653v39.706122c0 27.167347-22.465306 49.632653-49.632653 49.632653z m-263.314286-99.265306c-5.22449 0-9.926531 4.702041-9.92653 9.926531v39.706122c0 5.22449 4.702041 9.926531 9.92653 9.926531h263.314286c5.22449 0 9.926531-4.702041 9.92653-9.926531v-39.706122c0-5.22449-4.702041-9.926531-9.92653-9.926531H380.342857z"
                fill="#AF8015"
                p-id="7065"
              ></path>
              <path
                d="M725.681633 909.061224H298.840816c-43.885714 0-79.412245-35.526531-79.412245-79.412244V363.102041h585.665307v466.546939c0 43.885714-36.04898 79.412245-79.412245 79.412244z"
                fill="#F2CB51"
                p-id="7066"
              ></path>
              <path
                d="M412.734694 780.016327c-10.971429 0-19.853061-8.881633-19.853061-19.853062V512c0-10.971429 8.881633-19.853061 19.853061-19.853061s19.853061 8.881633 19.853061 19.853061v248.163265c0 10.971429-8.881633 19.853061-19.853061 19.853062z"
                fill="#AF8015"
                p-id="7067"
              ></path>
              <path
                d="M611.265306 780.016327c-10.971429 0-19.853061-8.881633-19.853061-19.853062V512c0-10.971429 8.881633-19.853061 19.853061-19.853061s19.853061 8.881633 19.853061 19.853061v248.163265c0 10.971429-8.881633 19.853061-19.853061 19.853062z"
                fill="#AF8015"
                p-id="7068"
              ></path>
              <path
                d="M829.64898 402.808163H194.35102c-43.885714 0-79.412245-35.526531-79.412244-79.412245v-29.779591C114.938776 249.730612 150.465306 214.204082 194.35102 214.204082h635.29796c43.885714 0 79.412245 35.526531 79.412244 79.412245v29.779591c0 43.885714-35.526531 79.412245-79.412244 79.412245z"
                fill="#DBAD2C"
                p-id="7069"
              ></path>
            </svg>
          </div>
        </template>
      </el-table-column>
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
