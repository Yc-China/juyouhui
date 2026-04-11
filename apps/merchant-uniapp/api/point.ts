import request from './request'

// 查询用户信息返回
export interface UserInfo {
	id: number
	nickname: string
	phone: string
	avatar?: string
	totalPoints: number // 用户当前总积分
	availablePoints: number // 用户可用积分
}

// 发放积分参数
export interface GrantPointsParams {
	userId: number
	consumptionAmount: number // 消费金额（元）
}

// 根据用户ID查询用户信息
export function getUserInfoApi(userId: number) {
	return request<UserInfo>({
		url: `/user/${userId}`,
		method: 'GET'
	})
}

// 发放积分接口
export function grantPointsApi(params: GrantPointsParams) {
	return request({
		url: '/merchant/points/add',
		method: 'POST',
		data: params
	})
}

// 获取积分记录列表
export interface PointRecord {
	id: number
	userId: number
	user: {
		id: number
		nickname: string
		phone: string
	}
	points: number
	consumptionAmount: number
	createdAt: string
}

export function getPointRecordListApi(params: { page?: number; pageSize?: number }) {
	return request<{
		records: PointRecord[]
		total: number
		page: number
		pageSize: number
	}>({
		url: '/merchant/points/records',
		method: 'GET',
		data: params
	})
}
