import { BASE_URL, TOKEN_KEY } from './config'

// 统一请求封装
interface RequestOptions {
	url: string
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
	data?: any
}

function request<T>(options: RequestOptions): Promise<T> {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync(TOKEN_KEY)

		let requestData = options.data
		let contentType = 'application/json'

		// 对于 POST JSON 请求，手动序列化 body
		if (options.method && options.method !== 'GET' && options.data) {
			requestData = JSON.stringify(options.data)
		}

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: requestData,
			header: {
				'Authorization': token ? `Bearer ${token}` : '',
				'Content-Type': contentType
			},
			success: (res) => {
				const data: any = res.data

				console.log('接口响应', data)

				// 这里根据你的接口返回格式调整
				if (data.code === 0 || data.code === 200) {
					resolve(data.data)
				} else {
					uni.showToast({
						title: data.message || '请求失败',
						icon: 'none'
					})

					// 如果是未授权，跳转到登录页
					if (data.code === 401) {
						uni.removeStorageSync(TOKEN_KEY)
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}

					reject(data)
				}
			},
			fail: (err) => {
				console.error('请求失败', err)
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

export default request
export { request }
