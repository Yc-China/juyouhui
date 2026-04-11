// 省市区三级数据
export interface AreaItem {
  name: string;
  code: string;
  children?: AreaItem[];
}

// 简化的省市区数据（主要省份城市）
export const areaData: AreaItem[] = [
  {
    name: '北京市',
    code: '110000',
    children: [
      {
        name: '北京市',
        code: '110100',
        children: [
          { name: '东城区', code: '110101' },
          { name: '西城区', code: '110102' },
          { name: '崇文区', code: '110103' },
          { name: '宣武区', code: '110104' },
          { name: '朝阳区', code: '110105' },
          { name: '丰台区', code: '110106' },
          { name: '石景山区', code: '110107' },
          { name: '海淀区', code: '110108' },
          { name: '门头沟区', code: '110109' },
          { name: '房山区', code: '110111' },
          { name: '通州区', code: '110112' },
          { name: '顺义区', code: '110113' },
          { name: '昌平区', code: '110114' },
          { name: '大兴区', code: '110115' },
          { name: '怀柔区', code: '110116' },
          { name: '平谷区', code: '110117' },
          { name: '密云区', code: '110118' },
          { name: '延庆区', code: '110119' },
        ]
      }
    ]
  },
  {
    name: '上海市',
    code: '310000',
    children: [
      {
        name: '上海市',
        code: '310100',
        children: [
          { name: '黄浦区', code: '310101' },
          { name: '徐汇区', code: '310104' },
          { name: '长宁区', code: '310105' },
          { name: '静安区', code: '310106' },
          { name: '普陀区', code: '310107' },
          { name: '虹口区', code: '310109' },
          { name: '杨浦区', code: '310110' },
          { name: '闵行区', code: '310112' },
          { name: '宝山区', code: '310113' },
          { name: '嘉定区', code: '310114' },
          { name: '浦东新区', code: '310115' },
          { name: '金山区', code: '310116' },
          { name: '松江区', code: '310117' },
          { name: '青浦区', code: '310118' },
          { name: '奉贤区', code: '310120' },
          { name: '崇明区', code: '310151' },
        ]
      }
    ]
  },
  {
    name: '广东省',
    code: '440000',
    children: [
      {
        name: '广州市',
        code: '440100',
        children: [
          { name: '荔湾区', code: '440103' },
          { name: '越秀区', code: '440104' },
          { name: '海珠区', code: '440105' },
          { name: '天河区', code: '440106' },
          { name: '白云区', code: '440111' },
          { name: '黄埔区', code: '440112' },
          { name: '番禺区', code: '440113' },
          { name: '花都区', code: '440114' },
          { name: '南沙区', code: '440115' },
          { name: '从化区', code: '440117' },
          { name: '增城区', code: '440118' },
        ]
      },
      {
        name: '深圳市',
        code: '440300',
        children: [
          { name: '罗湖区', code: '440303' },
          { name: '福田区', code: '440304' },
          { name: '南山区', code: '440305' },
          { name: '宝安区', code: '440306' },
          { name: '龙岗区', code: '440307' },
          { name: '盐田区', code: '440308' },
          { name: '龙华区', code: '440309' },
          { name: '坪山区', code: '440310' },
          { name: '光明区', code: '440311' },
        ]
      },
      {
        name: '佛山市',
        code: '440600',
        children: [
          { name: '禅城区', code: '440604' },
          { name: '南海区', code: '440605' },
          { name: '顺德区', code: '440606' },
          { name: '三水区', code: '440607' },
          { name: '高明区', code: '440608' },
        ]
      },
      {
        name: '东莞市',
        code: '441900',
        children: [
          { name: '东城街道', code: '441901' },
          { name: '南城街道', code: '441902' },
          { name: '万江街道', code: '441903' },
          { name: '莞城街道', code: '441904' },
          { name: '虎门镇', code: '441905' },
          { name: '长安镇', code: '441906' },
          { name: '厚街镇', code: '441907' },
          { name: '塘厦镇', code: '441908' },
        ]
      }
    ]
  },
  {
    name: '浙江省',
    code: '330000',
    children: [
      {
        name: '杭州市',
        code: '330100',
        children: [
          { name: '上城区', code: '330102' },
          { name: '拱墅区', code: '330105' },
          { name: '西湖区', code: '330106' },
          { name: '滨江区', code: '330108' },
          { name: '萧山区', code: '330109' },
          { name: '余杭区', code: '330110' },
          { name: '钱塘区', code: '330114' },
          { name: '富阳区', code: '330111' },
          { name: '临安区', code: '330112' },
        ]
      },
      {
        name: '宁波市',
        code: '330200',
        children: [
          { name: '海曙区', code: '330203' },
          { name: '江北区', code: '330205' },
          { name: '镇海区', code: '330211' },
          { name: '鄞州区', code: '330212' },
          { name: '奉化区', code: '330213' },
        ]
      }
    ]
  },
  {
    name: '江苏省',
    code: '320000',
    children: [
      {
        name: '南京市',
        code: '320100',
        children: [
          { name: '玄武区', code: '320102' },
          { name: '秦淮区', code: '320104' },
          { name: '建邺区', code: '320105' },
          { name: '鼓楼区', code: '320106' },
          { name: '栖霞区', code: '320113' },
          { name: '雨花台区', code: '320114' },
          { name: '江宁区', code: '320115' },
          { name: '浦口区', code: '320111' },
          { name: '六合区', code: '320116' },
        ]
      },
      {
        name: '苏州市',
        code: '320500',
        children: [
          { name: '姑苏区', code: '320508' },
          { name: '虎丘区', code: '320505' },
          { name: '吴中区', code: '320506' },
          { name: '相城区', code: '320507' },
          { name: '吴江区', code: '320509' },
          { name: '苏州工业园区', code: '320590' },
        ]
      }
    ]
  },
  {
    name: '四川省',
    code: '510000',
    children: [
      {
        name: '成都市',
        code: '510100',
        children: [
          { name: '锦江区', code: '510104' },
          { name: '青羊区', code: '510105' },
          { name: '金牛区', code: '510106' },
          { name: '武侯区', code: '510107' },
          { name: '成华区', code: '510108' },
          { name: '龙泉驿区', code: '510112' },
          { name: '青白江区', code: '510113' },
          { name: '新都区', code: '510114' },
          { name: '温江区', code: '510115' },
          { name: '双流区', code: '510116' },
          { name: '郫都区', code: '510117' },
        ]
      }
    ]
  },
  {
    name: '山东省',
    code: '370000',
    children: [
      {
        name: '济南市',
        code: '370100',
        children: [
          { name: '历下区', code: '370102' },
          { name: '市中区', code: '370103' },
          { name: '槐荫区', code: '370104' },
          { name: '天桥区', code: '370105' },
          { name: '历城区', code: '370112' },
        ]
      },
      {
        name: '青岛市',
        code: '370200',
        children: [
          { name: '市南区', code: '370202' },
          { name: '市北区', code: '370203' },
          { name: '黄岛区', code: '370211' },
          { name: '崂山区', code: '370212' },
          { name: '李沧区', code: '370213' },
          { name: '城阳区', code: '370214' },
        ]
      }
    ]
  },
  {
    name: '河南省',
    code: '410000',
    children: [
      {
        name: '郑州市',
        code: '410100',
        children: [
          { name: '中原区', code: '410102' },
          { name: '二七区', code: '410103' },
          { name: '管城回族区', code: '410104' },
          { name: '金水区', code: '410105' },
          { name: '高新区', code: '410106' },
          { name: '郑东新区', code: '410107' },
        ]
      }
    ]
  },
  {
    name: '湖北省',
    code: '420000',
    children: [
      {
        name: '武汉市',
        code: '420100',
        children: [
          { name: '江岸区', code: '420102' },
          { name: '江汉区', code: '420103' },
          { name: '硚口区', code: '420104' },
          { name: '汉阳区', code: '420105' },
          { name: '武昌区', code: '420106' },
          { name: '青山区', code: '420107' },
          { name: '洪山区', code: '420111' },
          { name: '东西湖区', code: '420112' },
        ]
      }
    ]
  },
  {
    name: '湖南省',
    code: '430000',
    children: [
      {
        name: '长沙市',
        code: '430100',
        children: [
          { name: '芙蓉区', code: '430102' },
          { name: '天心区', code: '430103' },
          { name: '岳麓区', code: '430104' },
          { name: '开福区', code: '430105' },
          { name: '雨花区', code: '430111' },
          { name: '望城区', code: '430112' },
        ]
      }
    ]
  },
  {
    name: '重庆市',
    code: '500000',
    children: [
      {
        name: '重庆市',
        code: '500100',
        children: [
          { name: '渝中区', code: '500103' },
          { name: '江北区', code: '500105' },
          { name: '沙坪坝区', code: '500106' },
          { name: '九龙坡区', code: '500107' },
          { name: '南岸区', code: '500108' },
          { name: '渝北区', code: '500112' },
          { name: '巴南区', code: '500113' },
          { name: '北碚区', code: '500109' },
          { name: '两江新区', code: '500190' },
        ]
      }
    ]
  },
  {
    name: '陕西省',
    code: '610000',
    children: [
      {
        name: '西安市',
        code: '610100',
        children: [
          { name: '新城区', code: '610102' },
          { name: '碑林区', code: '610103' },
          { name: '莲湖区', code: '610104' },
          { name: '雁塔区', code: '610113' },
          { name: '未央区', code: '610112' },
          { name: '灞桥区', code: '610111' },
        ]
      }
    ]
  },
  {
    name: '福建省',
    code: '350000',
    children: [
      {
        name: '福州市',
        code: '350100',
        children: [
          { name: '鼓楼区', code: '350102' },
          { name: '台江区', code: '350103' },
          { name: '仓山区', code: '350104' },
          { name: '晋安区', code: '350111' },
        ]
      },
      {
        name: '厦门市',
        code: '350200',
        children: [
          { name: '思明区', code: '350203' },
          { name: '湖里区', code: '350206' },
          { name: '集美区', code: '350211' },
          { name: '同安区', code: '350212' },
          { name: '翔安区', code: '350213' },
        ]
      }
    ]
  },
  {
    name: '天津市',
    code: '120000',
    children: [
      {
        name: '天津市',
        code: '120100',
        children: [
          { name: '和平区', code: '120101' },
          { name: '河东区', code: '120102' },
          { name: '河西区', code: '120103' },
          { name: '南开区', code: '120104' },
          { name: '河北区', code: '120105' },
          { name: '红桥区', code: '120106' },
          { name: '东丽区', code: '120110' },
          { name: '西青区', code: '120111' },
          { name: '北辰区', code: '120112' },
          { name: '武清区', code: '120114' },
          { name: '滨海新区', code: '120116' },
        ]
      }
    ]
  }
];

// 获取所有省份
export function getProvinces() {
  return areaData.map(item => ({ name: item.name, code: item.code }));
}

// 根据省份code获取城市列表
export function getCities(provinceCode: string) {
  const province = areaData.find(p => p.code === provinceCode);
  return province?.children?.map(city => ({ name: city.name, code: city.code })) || [];
}

// 根据省份code和城市code获取区县列表
export function getDistricts(provinceCode: string, cityCode: string) {
  const province = areaData.find(p => p.code === provinceCode);
  if (!province) return [];
  const city = province.children?.find(c => c.code === cityCode);
  return city?.children?.map(district => ({ name: district.name, code: district.code })) || [];
}
