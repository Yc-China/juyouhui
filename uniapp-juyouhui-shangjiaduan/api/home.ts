import request from './request'

// 商家信息返回
export interface MerchantProfile {
	id: number
	name: string
	contactName: string
	contactPhone: string
	address: string
	balancePoints: number // 余额积分，1积分 = 1分钱 = 0.01元
	deposit: number // 保证金
	pointRule: number // 积分规则：1消费多少元送1积分
	status: string
}

// 首页统计数据
export interface HomeStats {
	balance: number // 账户余额（元）
	todayPoints: number // 今日发放积分
	totalPoints: number // 累计发放积分
}

// 获取商家信息
export function getMerchantProfileApi() {
	return request<MerchantProfile>({
		url: '/merchant/profile',
		method: 'GET'
	})
}

// 获取首页统计数据
export function getHomeStatsApi() {
	return request<HomeStats>({
		url: '/merchant/home/stats',
		method: 'GET'
	})
}
