import React, { useState } from 'react'
import { getProvinces, getCities, getDistricts } from './data/areaData'

function App() {
  // 省市区状态
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [cities, setCities] = useState<Array<{name: string, code: string}>>([])
  const [districts, setDistricts] = useState<Array<{name: string, code: string}>>([])

  // 省份变化更新城市
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value
    setSelectedProvince(provinceCode)
    setCities(getCities(provinceCode))
    // 重置城市和区县
    setSelectedCity('')
    setDistricts([])
    setSelectedDistrict('')
  }

  // 城市变化更新区县
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = e.target.value
    setSelectedCity(cityCode)
    setDistricts(getDistricts(selectedProvince, cityCode))
    setSelectedDistrict('')
  }

  // 区县变化
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value)
  }

  const provinces = getProvinces()

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">聚</span>
              </div>
              <span className="text-xl font-bold text-gray-900">聚优惠</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-primary">优势</a>
              <a href="#how" className="text-gray-600 hover:text-primary">合作流程</a>
              <a href="#faq" className="text-gray-600 hover:text-primary">常见问题</a>
              <a href="#join" className="text-gray-600 hover:text-primary">立即加盟</a>
            </nav>
            <a href="#join" className="btn-primary hidden md:inline-block">免费入驻</a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero 区域 */}
        <section className="section bg-gradient-to-b from-accent to-white">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  汇聚餐饮<br />
                  <span className="text-primary">汇聚优惠</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                  餐饮积分联盟平台，帮您留住顾客，提升复购。<br />
                  <strong>所有商家免费加盟</strong>，零成本开启会员积分体系。
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#join" className="btn-primary text-lg">商家免费入驻</a>
                  <a href="#how" className="btn-secondary text-lg">了解更多</a>
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  ✅ 零加盟费 · ✅ 500元保证金可退 · ✅ 用多少充多少 · ✅ 快速上线
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎁</div>
                      <p className="text-gray-500">积分兑换礼品</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 核心优势 */}
        <section id="features" className="section">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">为什么选择聚优惠？</h2>
              <p className="mt-4 text-xl text-gray-600">免费帮您搭建会员积分体系，提升顾客复购率</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">零加盟费，可进可退</h3>
                <p className="text-gray-600">不收取加盟费，仅需缴纳 500 元保证金，保证金可退。用多少充多少，没有强制预存，风险可控。</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">跨店累计积分</h3>
                <p className="text-gray-600">用户在任意合作店铺消费都能累计积分，积分越多能兑换越好的礼品，提升用户粘性。</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">平台提供礼品</h3>
                <p className="text-gray-600">积分兑换的礼品由平台统一提供、统一发货，商家无需操心，只需要给用户加积分。</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">带来新顾客</h3>
                <p className="text-gray-600">用户为了攒积分会优先选择合作店铺，平台也会给商家引流，带来新客源。</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">简单易用</h3>
                <p className="text-gray-600">商家通过网页后台就能管理，扫码就能给用户加积分，几分钟就能上手。</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">快速上线</h3>
                <p className="text-gray-600">申请加盟后最快一天就能上线，不需要复杂的对接，省心省力。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 合作流程 */}
        <section id="how" className="section bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">合作流程</h2>
              <p className="mt-4 text-xl text-gray-600">简单四步，快速开启积分营销</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">提交申请</h3>
                <p className="text-gray-600">填写店铺信息，免费提交加盟申请</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">审核通过</h3>
                <p className="text-gray-600">我们审核通过后，开通商家后台</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">设置规则</h3>
                <p className="text-gray-600">设置消费多少赠送多少积分，开始营业</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
                <h3 className="text-xl font-semibold mb-2">开始揽客</h3>
                <p className="text-gray-600">顾客消费后扫码加积分，提升复购</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">常见问题</h2>
              <p className="mt-4 text-xl text-gray-600">解答您的疑问</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">真的完全免费吗？保证金是什么？</h3>
                <p className="text-gray-600">我们不收取加盟费，也不抽佣金。仅需要缴纳 500 元保证金，保证金可退，您退出平台时全额返还。保证金是为了保障平台规则，对真心做生意的商家没有任何成本。</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">积分充值是什么意思？</h3>
                <p className="text-gray-600">商家给用户发积分，需要先充值，1 分钱 = 1 积分，用多少充多少，没有强制最低充值。给用户发积分时，从您的余额扣除对应费用。这部分费用最终用于给用户兑换礼品，平台不截留，您花的每一分钱都变成给用户的优惠。</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">礼品是谁提供？谁发货？</h3>
                <p className="text-gray-600">积分兑换的礼品全部由平台提供，平台负责发货和售后，商家不需要做任何事情，只需要给顾客增加积分即可。</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">顾客怎么获得积分？</h3>
                <p className="text-gray-600">顾客在您店里消费后，商家在后台输入消费金额，系统自动计算积分，确认后积分实时到账顾客的聚优惠小程序账户。也可以扫码加积分，操作非常简单。</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">积分规则由谁定？</h3>
                <p className="text-gray-600">由商家自己决定，您可以设置消费1元赠送1积分，或者消费10元赠送1积分，完全由您自己说了算。</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">对商家有什么好处？</h3>
                <p className="text-gray-600">用户为了攒积分换礼品，会更愿意再来您店里消费，提升复购率。同时用户会优先选择聚优惠合作店铺，给您带来新顾客。您花的积分费用本质就是营销费用，比发传单效果更好。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 立即加盟 */}
        <section id="join" className="section bg-primary/5">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">立即免费加盟</h2>
              <p className="text-xl text-gray-600 mb-10">填写下方表单，我们会尽快联系您，开通您的商家后台。初审通过后再提供营业执照和门头照片做实名认证。</p>

              <form className="bg-white p-8 rounded-2xl shadow-sm text-left space-y-4" onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const provinceName = provinces.find(p => p.code === selectedProvince)?.name || ''
                const cityName = cities.find(c => c.code === selectedCity)?.name || ''
                const districtName = districts.find(d => d.code === selectedDistrict)?.name || ''
                const fullAddress = `${provinceName}${cityName}${districtName} ${formData.get('address')}`
                
                const data = {
                  name: formData.get('shopName') as string,
                  contactName: formData.get('contactName') as string,
                  contactPhone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  provinceCode: selectedProvince,
                  cityCode: selectedCity,
                  districtCode: selectedDistrict,
                  provinceName,
                  cityName,
                  districtName,
                  address: fullAddress.trim(),
                  traffic: formData.get('traffic') as string
                }

                // 检查必填项
                if (!data.name || !data.contactName || !data.contactPhone || !data.address || !selectedProvince || !selectedCity || !selectedDistrict) {
                  alert('请填写完整信息，选择省市区')
                  return
                }

                console.log('提交申请:', data)
                try {
                  const response = await fetch('https://api.weichuanghai.com/api/merchant/application', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                  })
                  const result = await response.json()
                  if (result.code === 0) {
                    alert('申请提交成功！我们会尽快审核，审核通过后会联系您。')
                    e.currentTarget.reset()
                    setSelectedProvince('')
                    setSelectedCity('')
                    setSelectedDistrict('')
                    setCities([])
                    setDistricts([])
                  } else {
                    alert(`提交失败：${result.message}`)
                  }
                } catch (err) {
                  console.error('提交错误:', err)
                  alert('网络错误，请稍后重试')
                }
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">店铺名称</label>
                  <input type="text" name="shopName" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="请填写店铺名称" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                  <input type="text" name="contactName" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="请填写联系人姓名" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                  <input type="tel" name="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="请填写联系电话" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input type="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="请填写邮箱地址" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">店铺所在地区</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select 
                      name="province"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      required
                    >
                      <option value="">请选择省</option>
                      {provinces.map(province => (
                        <option key={province.code} value={province.code}>{province.name}</option>
                      ))}
                    </select>
                    <select 
                      name="city"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                      value={selectedCity}
                      onChange={handleCityChange}
                      required
                      disabled={!selectedProvince}
                    >
                      <option value="">请选择市</option>
                      {cities.map(city => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                      ))}
                    </select>
                    <select 
                      name="district"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      required
                      disabled={!selectedCity}
                    >
                      <option value="">请选择区</option>
                      {districts.map(district => (
                        <option key={district.code} value={district.code}>{district.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
                  <input type="text" name="address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="请填写详细街道门牌" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">月均客流量</label>
                  <select name="traffic" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" required>
                    <option value="">请选择</option>
                    <option value="less-100">100人以下</option>
                    <option value="100-500">100-500人</option>
                    <option value="500-1000">500-1000人</option>
                    <option value="more-1000">1000人以上</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full btn-primary text-lg py-4">提交申请</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">聚</span>
                </div>
                <span className="text-xl font-bold text-white">聚优惠</span>
              </div>
              <p className="mt-2 text-sm">汇聚餐饮，汇聚优惠</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm">© 2026 聚优惠. All rights reserved.</p>
              <p className="mt-1 text-xs">免费加盟，助力餐饮商家提升复购</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
