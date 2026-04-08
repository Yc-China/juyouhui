import request from './request'

// 充值记录
export interface RechargeRecord {
	id: number
	merchantId: number
	amount: number // 金额（元）
	points: number // 获得积分，1分钱=1积分，所以 points = amount * 100
	status: string
	orderNo: string
	createdAt: string
}

// 充值参数
export interface RechargeParams {
	amount: number
}

// 充值返回
export interface RechargeResult {
	recharge: {
		id: number
	}
	orderNo: string
	amount: number
	points: number
}

// 获取账户信息和充值记录
export interface BalanceInfo {
	balancePoints: number // 余额积分，1积分 = 0.01元
	records: RechargeRecord[]
}

// 获取账户信息
export function getBalanceInfoApi() {
	return request<{
		records: RechargeRecord[]
		total: number
		page: number
	}>({
		url: '/merchant/recharge/records',
		method: 'GET',
		data: { page: 1, pageSize: 100 }
	})
}

// 创建充值订单
export function createRechargeApi(params: RechargeParams) {
	return request<RechargeResult>({
		url: '/merchant/recharge',
		method: 'POST',
		data: params
	})
}
