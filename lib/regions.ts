export interface RegionGroup {
  city: "제주시" | "서귀포시";
  regions: string[];
}

export const JEJU_REGIONS: RegionGroup[] = [
  {
    city: "제주시",
    regions: [
      "한림읍",
      "애월읍",
      "구좌읍",
      "조천읍",
      "한경면",
      "추자면",
      "우도면",
      "일도1동",
      "일도2동",
      "이도1동",
      "이도2동",
      "삼도1동",
      "삼도2동",
      "용담1동",
      "용담2동",
      "건입동",
      "화북동",
      "삼양동",
      "봉개동",
      "아라동",
      "오라동",
      "연동",
      "노형동",
      "외도동",
      "이호동",
      "도두동",
    ],
  },
  {
    city: "서귀포시",
    regions: [
      "대정읍",
      "남원읍",
      "성산읍",
      "안덕면",
      "표선면",
      "송산동",
      "정방동",
      "중앙동",
      "천지동",
      "효돈동",
      "영천동",
      "동홍동",
      "서홍동",
      "대륜동",
      "대천동",
      "중문동",
      "예래동",
    ],
  },
];

export const ALL_REGIONS: string[] = JEJU_REGIONS.flatMap((g) => g.regions);
