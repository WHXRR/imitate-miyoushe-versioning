import api from '@/service'

const getAppList = () => api({
  url: '/api/appList',
  method: 'post',
})

const getLatestVersion = () => api({
  url: '/api/latestVersion',
  method: 'post',
})

const addAppVersion = (data) => api({
  url: '/add/appVersion',
  method: 'post',
  data,
  tips: true
})

const delAppVersion = (data) => api({
  url: '/del/appVersion',
  method: 'post',
  data,
  tips: true
})

export default {
  getAppList,
  getLatestVersion,
  addAppVersion,
  delAppVersion
}