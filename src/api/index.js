import api from '@/service'

const getAppList = () => api({
  url: '/appList',
  method: 'post',
})

const getLatestVersion = () => api({
  url: '/latestVersion',
  method: 'post',
})

const addAppVersion = (data) => api({
  url: '/add/appVersion',
  method: 'post',
  data,
  tips: true
})

export default {
  getAppList,
  getLatestVersion,
  addAppVersion
}