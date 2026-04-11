import request from './request'

// 登录接口参数
export interface LoginParams {
	contactPhone: string
	password: string
}

// 登录接口返回
export interface LoginResult {
	token: string
	merchant: {
		id: number
		name: string
	}
}

// 商家登录
export function loginApi(params: LoginParams) {
	return request<LoginResult>({
		url: '/merchant/login',
		method: 'POST',
		data: params
	})
}

// 退出登录
export function logoutApi() {
	return request({
		url: '/merchant/logout',
		method: 'POST'
	})
}
