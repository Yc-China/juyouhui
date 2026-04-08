import request from './request'
import type { MerchantProfile } from '@/api/home'

// 商家本身就是一个门店，所以复用商家信息
export type Store = MerchantProfile

// 获取门店列表（单商家只有一个门店）
export function getStoreListApi() {
	// 实际上商家信息已经在 profile 里，这里直接返回，也可以单独获取
	return request<MerchantProfile>({
		url: '/merchant/profile',
		method: 'GET'
	})
}
