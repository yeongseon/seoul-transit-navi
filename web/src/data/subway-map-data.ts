import { LINES, type LineId } from "../../../shared/constants";

type SubwayLineId = Extract<LineId, "line_1" | "line_2" | "line_3" | "line_4" | "line_5" | "line_6" | "line_7" | "line_8" | "line_9" | "airport_rail" | "gyeongui_jungang" | "shinbundang">;
type LabelDirection = "n" | "s" | "e" | "w";
type RoutePreference = "auto" | "horizontal-first" | "vertical-first";

type StationMeta = {
  id: string;
  nameJa: string;
};

type Point = {
  x: number;
  y: number;
};

export type StationNumberBadge = {
  lineId: SubwayLineId;
  code: string;
  color: string;
};

export type SubwayMapStation = {
  id: string;
  x: number;
  y: number;
  nameJa: string;
  nameKo: string;
  lines: SubwayLineId[];
  stationNumbers: StationNumberBadge[];
  isTransfer: boolean;
  labelDirection: LabelDirection;
};

export type SubwayMapLine = {
  id: SubwayLineId;
  stationIds: string[];
  color: string;
  nameJa: string;
  nameKo: string;
  loop?: boolean;
  routePreference: RoutePreference;
};

const LINE_STATION_NAMES_KO = {
  line_1: ["서울역", "시청", "종각", "종로3가", "종로5가", "동대문", "동묘앞"],
  line_2: [
    "시청",
    "을지로입구",
    "을지로3가",
    "을지로4가",
    "동대문역사문화공원",
    "신당",
    "상왕십리",
    "왕십리",
    "한양대",
    "뚝섬",
    "성수",
    "건대입구",
    "구의",
    "강변",
    "잠실나루",
    "잠실",
    "잠실새내",
    "종합운동장",
    "삼성",
    "선릉",
    "역삼",
    "강남",
    "교대",
    "서초",
    "방배",
    "사당",
    "낙성대",
    "서울대입구",
    "봉천",
    "신림",
    "신대방",
    "구로디지털단지",
    "대림",
    "신도림",
    "문래",
    "영등포구청",
    "당산",
    "합정",
    "홍대입구",
    "신촌",
    "이대",
    "아현",
    "충정로",
  ],
  line_3: [
    "경복궁",
    "안국",
    "종로3가",
    "을지로3가",
    "충무로",
    "동대입구",
    "약수",
    "금호",
    "옥수",
    "압구정",
    "신사",
    "잠원",
    "고속터미널",
    "교대",
    "남부터미널",
    "양재",
    "매봉",
    "도곡",
    "대치",
    "학여울",
    "대청",
    "일원",
    "수서",
  ],
  line_4: ["명동", "충무로", "동대문역사문화공원", "동대문", "혜화", "한성대입구", "성신여대입구", "길음", "미아사거리", "삼각지", "숙대입구", "서울역", "회현"],
  line_5: ["방화", "개화산", "여의도", "여의나루", "마포", "광화문", "종로3가", "을지로4가", "동대문역사문화공원", "왕십리", "청구"],
  line_6: ["응암", "합정", "상수", "삼각지", "녹사평", "이태원", "한강진", "버티고개", "약수", "청구", "신당", "동묘앞"],
  line_7: ["장암", "건대입구", "이수", "남성", "숭실대입구", "상도", "장승배기", "신대방삼거리", "보라매", "신풍", "대림", "가산디지털단지"],
  line_8: ["잠실", "석촌", "모란"],
  line_9: ["개화", "여의도", "동작", "고속터미널", "신논현", "선정릉", "삼성중앙", "봉은사", "종합운동장", "삼전", "석촌고분", "석촌"],
  airport_rail: ["인천공항T1", "검암", "디지털미디어시티", "홍대입구", "공덕", "서울역"],
  gyeongui_jungang: ["디지털미디어시티", "가좌", "홍대입구", "서강대", "공덕", "효창공원앞", "용산", "이촌", "옥수", "왕십리"],
  shinbundang: ["신사", "논현", "신논현", "강남", "양재", "양재시민의숲", "청계산입구"],
} as const satisfies Record<SubwayLineId, readonly string[]>;

export const STATION_NUMBERS: Record<SubwayLineId, Record<string, string>> = {
  line_1: {
    "서울역": "133",
    "시청": "132",
    "종각": "131",
    "종로3가": "130",
    "종로5가": "129",
    "동대문": "128",
    "동묘앞": "127",
  },
  line_2: {
    "시청": "201",
    "을지로입구": "202",
    "을지로3가": "203",
    "을지로4가": "204",
    "동대문역사문화공원": "205",
    "신당": "206",
    "상왕십리": "207",
    "왕십리": "208",
    "한양대": "209",
    "뚝섬": "210",
    "성수": "211",
    "건대입구": "212",
    "구의": "213",
    "강변": "214",
    "잠실나루": "215",
    "잠실": "216",
    "잠실새내": "217",
    "종합운동장": "218",
    "삼성": "219",
    "선릉": "220",
    "역삼": "221",
    "강남": "222",
    "교대": "223",
    "서초": "224",
    "방배": "225",
    "사당": "226",
    "낙성대": "227",
    "서울대입구": "228",
    "봉천": "229",
    "신림": "230",
    "신대방": "231",
    "구로디지털단지": "232",
    "대림": "233",
    "신도림": "234",
    "문래": "235",
    "영등포구청": "236",
    "당산": "237",
    "합정": "238",
    "홍대입구": "239",
    "신촌": "240",
    "이대": "241",
    "아현": "242",
    "충정로": "243",
  },
  line_3: {
    "경복궁": "327",
    "안국": "328",
    "종로3가": "329",
    "을지로3가": "330",
    "충무로": "331",
    "동대입구": "332",
    "약수": "333",
    "금호": "334",
    "옥수": "335",
    "압구정": "336",
    "신사": "337",
    "잠원": "338",
    "고속터미널": "339",
    "교대": "340",
    "남부터미널": "341",
    "양재": "342",
    "매봉": "343",
    "도곡": "344",
    "대치": "345",
    "학여울": "346",
    "대청": "347",
    "일원": "348",
    "수서": "349",
  },
  line_4: {
    "명동": "424",
    "충무로": "423",
    "동대문역사문화공원": "422",
    "동대문": "421",
    "혜화": "420",
    "한성대입구": "419",
    "성신여대입구": "418",
    "길음": "417",
    "미아사거리": "416",
    "삼각지": "430",
    "숙대입구": "431",
    "서울역": "432",
    "회현": "425",
  },
  line_5: {
    "방화": "510",
    "개화산": "511",
    "여의도": "526",
    "여의나루": "527",
    "마포": "528",
    "광화문": "533",
    "종로3가": "534",
    "을지로4가": "535",
    "동대문역사문화공원": "536",
    "왕십리": "540",
    "청구": "541",
  },
  line_6: {
    "응암": "610",
    "합정": "622",
    "상수": "623",
    "삼각지": "630",
    "녹사평": "631",
    "이태원": "632",
    "한강진": "633",
    "버티고개": "634",
    "약수": "635",
    "청구": "636",
    "신당": "637",
    "동묘앞": "638",
  },
  line_7: {
    "장암": "709",
    "건대입구": "727",
    "이수": "740",
    "남성": "741",
    "숭실대입구": "742",
    "상도": "743",
    "장승배기": "744",
    "신대방삼거리": "745",
    "보라매": "746",
    "신풍": "747",
    "대림": "748",
    "가산디지털단지": "749",
  },
  line_8: {
    "잠실": "814",
    "석촌": "815",
    "모란": "818",
  },
  line_9: {
    "개화": "901",
    "여의도": "915",
    "동작": "920",
    "고속터미널": "923",
    "신논현": "924",
    "선정릉": "925",
    "삼성중앙": "926",
    "봉은사": "927",
    "종합운동장": "928",
    "삼전": "929",
    "석촌고분": "930",
    "석촌": "931",
  },
  airport_rail: {
    "인천공항T1": "A01",
    "검암": "A04",
    "디지털미디어시티": "A05",
    "홍대입구": "A06",
    "공덕": "A07",
    "서울역": "A08",
  },
  gyeongui_jungang: {
    "디지털미디어시티": "GJ04",
    "가좌": "GJ05",
    "홍대입구": "GJ06",
    "서강대": "GJ07",
    "공덕": "GJ08",
    "효창공원앞": "GJ09",
    "용산": "GJ10",
    "이촌": "GJ11",
    "옥수": "GJ13",
    "왕십리": "GJ16",
  },
  shinbundang: {
    "신사": "SB03",
    "논현": "SB04",
    "신논현": "SB05",
    "강남": "SB06",
    "양재": "SB07",
    "양재시민의숲": "SB08",
    "청계산입구": "SB09",
  },
};

const STATION_META_BY_KO: Record<string, StationMeta> = {
  "가산디지털단지": { id: "station_gasan-digital-complex", nameJa: "加山デジタル団地" },
  "가좌": { id: "station_gajwa", nameJa: "加佐" },
  "강남": { id: "station_gangnam", nameJa: "江南" },
  "강변": { id: "station_gangbyeon", nameJa: "江辺" },
  "개화": { id: "station_gaehwa", nameJa: "開花" },
  "개화산": { id: "station_gaehwasan", nameJa: "開花山" },
  "건대입구": { id: "station_konkuk-univ", nameJa: "建大入口" },
  "검암": { id: "station_geomam", nameJa: "黔岩" },
  "경복궁": { id: "station_gyeongbokgung", nameJa: "景福宮" },
  "고속터미널": { id: "station_express-bus-terminal", nameJa: "高速ターミナル" },
  "공덕": { id: "station_gongdeok", nameJa: "孔徳" },
  "광화문": { id: "station_gwanghwamun", nameJa: "光化門" },
  "교대": { id: "station_seoul-natl-univ-of-education", nameJa: "教大" },
  "구로디지털단지": { id: "station_guro-digital-complex", nameJa: "九老デジタル団地" },
  "구의": { id: "station_guui", nameJa: "九宜" },
  "금호": { id: "station_geumho", nameJa: "金湖" },
  "길음": { id: "station_gireum", nameJa: "吉音" },
  "낙성대": { id: "station_nakseongdae", nameJa: "落星台" },
  "남부터미널": { id: "station_nambu-bus-terminal", nameJa: "南部ターミナル" },
  "남성": { id: "station_namseong", nameJa: "南城" },
  "녹사평": { id: "station_noksapyeong", nameJa: "緑莎坪" },
  "논현": { id: "station_nonhyeon", nameJa: "論峴" },
  "당산": { id: "station_dangsan", nameJa: "堂山" },
  "대림": { id: "station_daerim", nameJa: "大林" },
  "대청": { id: "station_daecheong", nameJa: "大庁" },
  "디지털미디어시티": { id: "station_dmc", nameJa: "デジタルメディアシティ" },
  "대치": { id: "station_daechi", nameJa: "大峙" },
  "도곡": { id: "station_dogok", nameJa: "道谷" },
  "동대문": { id: "station_dongdaemun", nameJa: "東大門" },
  "동대문역사문화공원": { id: "station_dongdaemun-history-and-culture-park", nameJa: "東大門歴史文化公園" },
  "동대입구": { id: "station_dongguk-univ", nameJa: "東大入口" },
  "동묘앞": { id: "station_dongmyo", nameJa: "東廟前" },
  "동작": { id: "station_dongjak", nameJa: "銅雀" },
  "뚝섬": { id: "station_ttukseom", nameJa: "トゥクソム" },
  "마포": { id: "station_mapo", nameJa: "麻浦" },
  "매봉": { id: "station_maebong", nameJa: "梅峰" },
  "명동": { id: "station_myeongdong", nameJa: "明洞" },
  "모란": { id: "station_moran", nameJa: "牡丹" },
  "문래": { id: "station_mullae", nameJa: "文来" },
  "미아사거리": { id: "station_mia-sageori", nameJa: "ミア交差路" },
  "방배": { id: "station_bangbae", nameJa: "方背" },
  "방화": { id: "station_banghwa", nameJa: "傍花" },
  "버티고개": { id: "station_beotiggogae", nameJa: "ポティゴゲ" },
  "보라매": { id: "station_boramae", nameJa: "ボラメ" },
  "봉은사": { id: "station_bongeunsa", nameJa: "奉恩寺" },
  "봉천": { id: "station_bongcheon", nameJa: "奉天" },
  "사당": { id: "station_sadang", nameJa: "舎堂" },
  "삼각지": { id: "station_samgakji", nameJa: "三角地" },
  "삼성": { id: "station_samseong", nameJa: "三成" },
  "삼성중앙": { id: "station_samsung-jungang", nameJa: "三成中央" },
  "삼전": { id: "station_samjeon", nameJa: "三田" },
  "상도": { id: "station_sangdo", nameJa: "上道" },
  "상수": { id: "station_sangsu", nameJa: "上水" },
  "상왕십리": { id: "station_sangwangsimni", nameJa: "上往十里" },
  "서울대입구": { id: "station_seoul-natl-univ", nameJa: "ソウル大入口" },
  "서울역": { id: "station_seoul-station", nameJa: "ソウル駅" },
  "서강대": { id: "station_sogang-univ", nameJa: "西江大" },
  "서초": { id: "station_seocho", nameJa: "瑞草" },
  "석촌": { id: "station_seokchon", nameJa: "石村" },
  "석촌고분": { id: "station_seokchon-ancient-tombs", nameJa: "石村古墳" },
  "선릉": { id: "station_seolleung", nameJa: "宣陵" },
  "선정릉": { id: "station_seonjeongneung", nameJa: "宣靖陵" },
  "성수": { id: "station_seongsu", nameJa: "聖水" },
  "성신여대입구": { id: "station_sungshin-womens-univ", nameJa: "誠信女大入口" },
  "수서": { id: "station_suseo", nameJa: "水西" },
  "숙대입구": { id: "station_sookmyung-womens-univ", nameJa: "淑大入口" },
  "숭실대입구": { id: "station_soongsil-univ", nameJa: "崇実大入口" },
  "시청": { id: "station_city-hall", nameJa: "市庁" },
  "신논현": { id: "station_sinnonhyeon", nameJa: "新論峴" },
  "신당": { id: "station_sindang", nameJa: "新堂" },
  "신대방": { id: "station_sindaebang", nameJa: "新大方" },
  "신대방삼거리": { id: "station_sindaebang-samgeori", nameJa: "新大方三叉路" },
  "신도림": { id: "station_sindorim", nameJa: "新道林" },
  "신림": { id: "station_sillim", nameJa: "新林" },
  "신사": { id: "station_sinsa", nameJa: "新沙" },
  "신촌": { id: "station_sinchon", nameJa: "新村" },
  "신풍": { id: "station_sinpung", nameJa: "新豊" },
  "아현": { id: "station_ahyeon", nameJa: "阿峴" },
  "안국": { id: "station_anguk", nameJa: "安国" },
  "압구정": { id: "station_apgujeong", nameJa: "狎鷗亭" },
  "약수": { id: "station_yaksu", nameJa: "薬水" },
  "양재": { id: "station_yangjae", nameJa: "良才" },
  "양재시민의숲": { id: "station_yangjae-citizens-forest", nameJa: "良才市民の森" },
  "여의나루": { id: "station_yeouinaru", nameJa: "汝矣ナル" },
  "여의도": { id: "station_yeouido", nameJa: "汝矣島" },
  "역삼": { id: "station_yeoksam", nameJa: "駅三" },
  "영등포구청": { id: "station_yeongdeungpo-gu-office", nameJa: "永登浦区庁" },
  "옥수": { id: "station_oksu", nameJa: "玉水" },
  "왕십리": { id: "station_wangsimni", nameJa: "往十里" },
  "용산": { id: "station_yongsan", nameJa: "龍山" },
  "을지로3가": { id: "station_euljiro-3-ga", nameJa: "乙支路3街" },
  "을지로4가": { id: "station_euljiro-4-ga", nameJa: "乙支路4街" },
  "을지로입구": { id: "station_euljiro-1-ga", nameJa: "乙支路入口" },
  "응암": { id: "station_eungam", nameJa: "鷹岩" },
  "이대": { id: "station_ewha-womans-univ", nameJa: "梨大" },
  "이수": { id: "station_isu", nameJa: "梨水" },
  "이촌": { id: "station_ichon", nameJa: "二村" },
  "이태원": { id: "station_itaewon", nameJa: "梨泰院" },
  "일원": { id: "station_irwon", nameJa: "逸院" },
  "인천공항T1": { id: "station_incheon-airport-t1", nameJa: "仁川空港T1" },
  "잠실": { id: "station_jamsil", nameJa: "蚕室" },
  "잠실나루": { id: "station_jamsillaru", nameJa: "チャムシルナル" },
  "잠실새내": { id: "station_jamsilsaenae", nameJa: "チャムシルセネ" },
  "잠원": { id: "station_jamwon", nameJa: "蚕院" },
  "장승배기": { id: "station_jangseungbaegi", nameJa: "チャンスンベギ" },
  "장암": { id: "station_jangam", nameJa: "長岩" },
  "종각": { id: "station_jonggak", nameJa: "鍾閣" },
  "종로3가": { id: "station_jongno-3-ga", nameJa: "鍾路3街" },
  "종로5가": { id: "station_jongno-5-ga", nameJa: "鍾路5街" },
  "종합운동장": { id: "station_sports-complex", nameJa: "総合運動場" },
  "청구": { id: "station_cheonggu", nameJa: "青丘" },
  "청계산입구": { id: "station_cheonggyesan", nameJa: "清渓山入口" },
  "충무로": { id: "station_chungmuro", nameJa: "忠武路" },
  "충정로": { id: "station_chungjeongno", nameJa: "忠正路" },
  "학여울": { id: "station_hangnyeoul", nameJa: "ハンニョウル" },
  "한강진": { id: "station_hangangjin", nameJa: "漢江鎮" },
  "한성대입구": { id: "station_hansung-univ", nameJa: "漢城大入口" },
  "한양대": { id: "station_hanyang-univ", nameJa: "漢陽大" },
  "합정": { id: "station_hapjeong", nameJa: "合井" },
  "혜화": { id: "station_hyehwa", nameJa: "恵化" },
  "효창공원앞": { id: "station_hyochang-park", nameJa: "孝昌公園前" },
  "홍대입구": { id: "station_hongik-univ", nameJa: "弘大入口" },
  "회현": { id: "station_hoehyeon", nameJa: "会賢" },
};

const ANCHOR_COORDS_BY_KO: Record<string, Point> = {
  "서울역": { x: 62, y: 54 },
  "시청": { x: 76, y: 34 },
  "종각": { x: 84, y: 26 },
  "종로3가": { x: 92, y: 26 },
  "종로5가": { x: 100, y: 26 },
  "동대문": { x: 108, y: 26 },
  "동묘앞": { x: 116, y: 26 },
  "을지로4가": { x: 100, y: 34 },
  "동대문역사문화공원": { x: 108, y: 34 },
  "신당": { x: 116, y: 42 },
  "왕십리": { x: 132, y: 58 },
  "한양대": { x: 138, y: 66 },
  "성수": { x: 138, y: 82 },
  "건대입구": { x: 138, y: 90 },
  "강변": { x: 154, y: 106 },
  "잠실": { x: 162, y: 122 },
  "종합운동장": { x: 146, y: 138 },
  "강남": { x: 114, y: 138 },
  "교대": { x: 106, y: 138 },
  "사당": { x: 82, y: 138 },
  "신림": { x: 50, y: 106 },
  "대림": { x: 26, y: 82 },
  "신도림": { x: 18, y: 74 },
  "당산": { x: 18, y: 50 },
  "합정": { x: 26, y: 42 },
  "홍대입구": { x: 34, y: 34 },
  "이대": { x: 50, y: 18 },
  "아현": { x: 58, y: 18 },
  "충정로": { x: 66, y: 26 },
  "경복궁": { x: 76, y: 10 },
  "안국": { x: 84, y: 18 },
  "을지로3가": { x: 92, y: 34 },
  "충무로": { x: 92, y: 50 },
  "동대입구": { x: 98, y: 58 },
  "약수": { x: 104, y: 66 },
  "옥수": { x: 120, y: 82 },
  "압구정": { x: 128, y: 90 },
  "신사": { x: 128, y: 102 },
  "고속터미널": { x: 112, y: 118 },
  "양재": { x: 114, y: 154 },
  "도곡": { x: 130, y: 162 },
  "수서": { x: 170, y: 162 },
  "명동": { x: 84, y: 58 },
  "혜화": { x: 108, y: 18 },
  "성신여대입구": { x: 124, y: 10 },
  "미아사거리": { x: 140, y: 10 },
  "삼각지": { x: 70, y: 82 },
  "회현": { x: 70, y: 54 },
  "방화": { x: 0, y: 58 },
  "개화산": { x: 8, y: 58 },
  "여의도": { x: 20, y: 58 },
  "여의나루": { x: 28, y: 58 },
  "마포": { x: 36, y: 58 },
  "광화문": { x: 76, y: 18 },
  "청구": { x: 124, y: 66 },
  "응암": { x: 10, y: 26 },
  "상수": { x: 34, y: 50 },
  "이태원": { x: 86, y: 82 },
  "한강진": { x: 94, y: 74 },
  "장암": { x: 138, y: 0 },
  "이수": { x: 90, y: 138 },
  "숭실대입구": { x: 62, y: 154 },
  "장승배기": { x: 42, y: 162 },
  "보라매": { x: 26, y: 146 },
  "신풍": { x: 18, y: 138 },
  "가산디지털단지": { x: 18, y: 122 },
  "석촌": { x: 170, y: 130 },
  "모란": { x: 178, y: 138 },
  "개화": { x: 0, y: 70 },
  "동작": { x: 80, y: 118 },
  "신논현": { x: 120, y: 126 },
  "선정릉": { x: 128, y: 126 },
  "봉은사": { x: 144, y: 126 },
  "인천공항T1": { x: -30, y: 42 },
  "검암": { x: -14, y: 42 },
  "디지털미디어시티": { x: 18, y: 26 },
  "공덕": { x: 44, y: 50 },
  "가좌": { x: 26, y: 34 },
  "서강대": { x: 42, y: 42 },
  "효창공원앞": { x: 54, y: 66 },
  "용산": { x: 62, y: 74 },
  "이촌": { x: 78, y: 82 },
  "논현": { x: 120, y: 118 },
  "양재시민의숲": { x: 114, y: 162 },
  "청계산입구": { x: 114, y: 170 },
};

const LABEL_OVERRIDES_BY_KO: Partial<Record<string, LabelDirection>> = {
  "서울역": "s",
  "시청": "w",
  "종로3가": "n",
  "을지로3가": "e",
  "을지로4가": "s",
  "동대문역사문화공원": "e",
  "동대문": "n",
  "동묘앞": "e",
  "신당": "e",
  "왕십리": "e",
  "건대입구": "e",
  "잠실": "e",
  "종합운동장": "s",
  "강남": "s",
  "교대": "s",
  "대림": "w",
  "합정": "w",
  "충무로": "w",
  "약수": "w",
  "고속터미널": "w",
  "삼각지": "s",
  "여의도": "s",
  "청구": "e",
  "석촌": "e",
  "공덕": "s",
  "디지털미디어시티": "n",
  "인천공항T1": "w",
  "용산": "s",
  "이촌": "n",
  "논현": "w",
};

const TRANSFER_STATION_NAMES = new Set([
  "서울역",
  "시청",
  "종로3가",
  "동대문",
  "동묘앞",
  "을지로3가",
  "을지로4가",
  "동대문역사문화공원",
  "신당",
  "왕십리",
  "건대입구",
  "잠실",
  "종합운동장",
  "교대",
  "대림",
  "합정",
  "충무로",
  "약수",
  "고속터미널",
  "삼각지",
  "여의도",
  "청구",
  "석촌",
  "홍대입구",
  "공덕",
  "디지털미디어시티",
  "옥수",
  "신사",
  "신논현",
  "강남",
  "양재",
]);

function interpolatePoint(from: Point, to: Point, index: number, totalSteps: number): Point {
  const ratio = index / totalSteps;

  return {
    x: Number((from.x + (to.x - from.x) * ratio).toFixed(2)),
    y: Number((from.y + (to.y - from.y) * ratio).toFixed(2)),
  };
}

function buildStationCoords(): Map<string, Point> {
  const coords = new Map<string, Point>();

  for (const stationNames of Object.values(LINE_STATION_NAMES_KO)) {
    const anchorIndexes = stationNames
      .map((stationNameKo, index) => ({ stationNameKo: stationNameKo as string, index, point: ANCHOR_COORDS_BY_KO[stationNameKo] }))
      .filter((entry): entry is { stationNameKo: string; index: number; point: Point } => Boolean(entry.point));

    for (let anchorIndex = 0; anchorIndex < anchorIndexes.length - 1; anchorIndex += 1) {
      const currentAnchor = anchorIndexes[anchorIndex];
      const nextAnchor = anchorIndexes[anchorIndex + 1];
      const segmentNames = stationNames.slice(currentAnchor.index, nextAnchor.index + 1);
      const segmentStepCount = segmentNames.length - 1;

      segmentNames.forEach((stationNameKo, segmentIndex) => {
        const point = segmentIndex === 0
          ? currentAnchor.point
          : segmentIndex === segmentStepCount
            ? nextAnchor.point
            : interpolatePoint(currentAnchor.point, nextAnchor.point, segmentIndex, segmentStepCount);

        if (!coords.has(stationNameKo)) {
          coords.set(stationNameKo, point);
        }
      });
    }
  }

  return coords;
}

function buildStationLines(): Map<string, SubwayLineId[]> {
  const stationLines = new Map<string, Set<SubwayLineId>>();

  for (const [lineId, stationNames] of Object.entries(LINE_STATION_NAMES_KO) as [SubwayLineId, readonly string[]][]) {
    for (const stationNameKo of stationNames) {
      const existing = stationLines.get(stationNameKo) ?? new Set<SubwayLineId>();
      existing.add(lineId);
      stationLines.set(stationNameKo, existing);
    }
  }

  return new Map(
    Array.from(stationLines.entries()).map(([stationNameKo, lines]) => [
      stationNameKo,
      Array.from(lines).sort((left, right) => LINES[left].lineNumber - LINES[right].lineNumber),
    ]),
  );
}

function buildStationNumbers(): Map<string, StationNumberBadge[]> {
  const stationNumbers = new Map<string, StationNumberBadge[]>();

  for (const [lineId, stationCodes] of Object.entries(STATION_NUMBERS) as [SubwayLineId, Record<string, string>][]) {
    for (const [stationNameKo, code] of Object.entries(stationCodes)) {
      const existing = stationNumbers.get(stationNameKo) ?? [];
      existing.push({ lineId, code, color: LINES[lineId].color });
      stationNumbers.set(stationNameKo, existing);
    }
  }

  return new Map(
    Array.from(stationNumbers.entries()).map(([stationNameKo, badges]) => [
      stationNameKo,
      badges.sort((left, right) => LINES[left.lineId].lineNumber - LINES[right.lineId].lineNumber),
    ]),
  );
}

for (const [lineId, stationNames] of Object.entries(LINE_STATION_NAMES_KO) as [SubwayLineId, readonly string[]][]) {
  for (const stationNameKo of stationNames) {
    if (!STATION_NUMBERS[lineId]?.[stationNameKo]) {
      throw new Error(`Missing station number for ${lineId}: ${stationNameKo}`);
    }
  }
}

const STATION_COORDS_BY_KO = buildStationCoords();
const STATION_LINES_BY_KO = buildStationLines();
const STATION_NUMBER_BADGES_BY_KO = buildStationNumbers();

function getLabelDirection(stationNameKo: string, lines: SubwayLineId[]): LabelDirection {
  const override = LABEL_OVERRIDES_BY_KO[stationNameKo];

  if (override) {
    return override;
  }

  const primaryLine = lines[0];
  const stationNames = LINE_STATION_NAMES_KO[primaryLine];
  const stationIndex = (stationNames as readonly string[]).indexOf(stationNameKo);
  const current = STATION_COORDS_BY_KO.get(stationNameKo);
  const prev = stationIndex > 0 ? STATION_COORDS_BY_KO.get(stationNames[stationIndex - 1]) : undefined;
  const next = stationIndex < stationNames.length - 1 ? STATION_COORDS_BY_KO.get(stationNames[stationIndex + 1]) : undefined;

  if (!current) {
    return "e";
  }

  const referenceStart = prev ?? current;
  const referenceEnd = next ?? current;
  const dx = referenceEnd.x - referenceStart.x;
  const dy = referenceEnd.y - referenceStart.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return stationIndex % 2 === 0 ? "n" : "s";
  }

  return stationIndex % 2 === 0 ? "w" : "e";
}

export const SUBWAY_MAP_STATIONS: SubwayMapStation[] = Object.entries(STATION_META_BY_KO)
  .map(([nameKo, meta]) => {
    const point = STATION_COORDS_BY_KO.get(nameKo);
    const lines = STATION_LINES_BY_KO.get(nameKo);
    const stationNumbers = STATION_NUMBER_BADGES_BY_KO.get(nameKo) ?? [];

    if (!point || !lines) {
      throw new Error(`Missing subway map layout for station: ${nameKo}`);
    }

    return {
      id: meta.id,
      x: point.x,
      y: point.y,
      nameJa: meta.nameJa,
      nameKo,
      lines,
      stationNumbers,
      isTransfer: TRANSFER_STATION_NAMES.has(nameKo),
      labelDirection: getLabelDirection(nameKo, lines),
    };
  })
  .sort((left, right) => left.id.localeCompare(right.id));

export const SUBWAY_MAP_STATIONS_BY_ID: Record<string, SubwayMapStation> = Object.fromEntries(
  SUBWAY_MAP_STATIONS.map((station) => [station.id, station]),
);

export const SUBWAY_MAP_LINES: SubwayMapLine[] = (Object.entries(LINE_STATION_NAMES_KO) as [SubwayLineId, readonly string[]][]).map(([lineId, stationNames]) => ({
  id: lineId,
  stationIds: stationNames.map((stationNameKo) => STATION_META_BY_KO[stationNameKo].id),
  color: LINES[lineId].color,
  nameJa: LINES[lineId].nameJa,
  nameKo: LINES[lineId].nameKo,
  loop: lineId === "line_2",
  routePreference:
    lineId === "line_3" || lineId === "line_4" || lineId === "line_6"
      ? "vertical-first"
      : lineId === "line_7" || lineId === "shinbundang"
        ? "auto"
        : "horizontal-first",
}));

export const SUBWAY_MAP_VIEW_BOX = "-36 -6 228 184";
export const SUBWAY_MAP_CANVAS_SIZE = { width: 1824, height: 1472 };
export const SUBWAY_MAP_INITIAL_SCROLL = { leftRatio: 0.3, topRatio: 0.16 };
