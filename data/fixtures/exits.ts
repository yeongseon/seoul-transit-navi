export type ExitFixture = {
  id: string;
  stationId: string;
  exitNumber: string;
  labelJa: string;
  descriptionJa: string;
  walkingTimeMin?: number;
  landmarkRefs: string[];
};

export const EXITS: ExitFixture[] = [
  { id: "exit_myeongdong_1", stationId: "station_myeongdong", exitNumber: "1", labelJa: "1番出口", descriptionJa: "明洞聖堂や乙支路寄りのエリアへ向かう出口です。朝の散策やカフェ巡りの起点に便利です。", walkingTimeMin: 4, landmarkRefs: ["明洞聖堂", "乙支路"] },
  { id: "exit_myeongdong_2", stationId: "station_myeongdong", exitNumber: "2", labelJa: "2番出口", descriptionJa: "忠武路方面へ出やすく、ホテル街や空港リムジン乗り場へ移動しやすい出口です。", walkingTimeMin: 5, landmarkRefs: ["忠武路", "ホテル街"] },
  { id: "exit_myeongdong_3", stationId: "station_myeongdong", exitNumber: "3", labelJa: "3番出口", descriptionJa: "Nソウルタワー・南山ケーブルカー方面へ向かうのに便利です。坂道に入る前の案内標識も見つけやすい出口です。", walkingTimeMin: 8, landmarkRefs: ["n-seoul-tower", "南山ケーブルカー"] },
  { id: "exit_myeongdong_4", stationId: "station_myeongdong", exitNumber: "4", labelJa: "4番出口", descriptionJa: "明洞の中心街西側へ向かう出口で、両替所やドラッグストアが多い通りに出られます。", walkingTimeMin: 3, landmarkRefs: ["myeongdong", "両替所通り"] },
  { id: "exit_myeongdong_5", stationId: "station_myeongdong", exitNumber: "5", labelJa: "5番出口", descriptionJa: "ロッテ百貨店・乙支路入口方面へ歩く際に便利な出口です。ショッピング動線が組みやすい場所に出られます。", walkingTimeMin: 7, landmarkRefs: ["ロッテ百貨店", "乙支路入口"] },
  { id: "exit_myeongdong_6", stationId: "station_myeongdong", exitNumber: "6", labelJa: "6番出口", descriptionJa: "明洞ショッピング通りへ直結。コスメ店やファッションビルが並ぶメインストリートへすぐ出られます。", walkingTimeMin: 2, landmarkRefs: ["myeongdong", "明洞ショッピング通り"] },
  { id: "exit_myeongdong_7", stationId: "station_myeongdong", exitNumber: "7", labelJa: "7番出口", descriptionJa: "明洞芸術劇場や繁華街北側へ向かう出口です。夜の食事や街歩きにも便利です。", walkingTimeMin: 4, landmarkRefs: ["明洞芸術劇場", "myeongdong"] },
  { id: "exit_myeongdong_8", stationId: "station_myeongdong", exitNumber: "8", labelJa: "8番出口", descriptionJa: "会賢・南大門市場方面へ移動しやすい出口です。徒歩で周辺観光をつなげたい時に便利です。", walkingTimeMin: 9, landmarkRefs: ["南大門市場", "会賢"] },

  { id: "exit_hongik-univ_1", stationId: "station_hongik-univ", exitNumber: "1", labelJa: "1番出口", descriptionJa: "合井方面へ続く大通り側に出る出口です。空港鉄道や周辺ホテルへ向かうときに分かりやすい位置です。", walkingTimeMin: 5, landmarkRefs: ["合井", "空港鉄道"] },
  { id: "exit_hongik-univ_2", stationId: "station_hongik-univ", exitNumber: "2", labelJa: "2番出口", descriptionJa: "延南洞方面へ歩きやすい出口です。落ち着いたカフェ通りや京義線の散歩道へつながります。", walkingTimeMin: 6, landmarkRefs: ["延南洞", "京義線森の道"] },
  { id: "exit_hongik-univ_3", stationId: "station_hongik-univ", exitNumber: "3", labelJa: "3番出口", descriptionJa: "空港鉄道・AREX乗換え動線に近く、スーツケース移動でも比較的使いやすい出口です。", walkingTimeMin: 3, landmarkRefs: ["AREX", "空港鉄道"] },
  { id: "exit_hongik-univ_4", stationId: "station_hongik-univ", exitNumber: "4", labelJa: "4番出口", descriptionJa: "弘大正門寄りの通りへ出る出口です。ライブハウスや若者向けショップへ向かうときに便利です。", walkingTimeMin: 7, landmarkRefs: ["弘益大学", "ライブハウス街"] },
  { id: "exit_hongik-univ_5", stationId: "station_hongik-univ", exitNumber: "5", labelJa: "5番出口", descriptionJa: "弘大カフェ通り南側へアクセスしやすい出口です。昼の散策やブランチにも向いています。", walkingTimeMin: 5, landmarkRefs: ["弘大カフェ通り", "hongdae"] },
  { id: "exit_hongik-univ_6", stationId: "station_hongik-univ", exitNumber: "6", labelJa: "6番出口", descriptionJa: "駐車場通り方面へ出る出口です。個性的なセレクトショップや写真スポットが多いエリアに向かえます。", walkingTimeMin: 6, landmarkRefs: ["駐車場通り", "hongdae"] },
  { id: "exit_hongik-univ_7", stationId: "station_hongik-univ", exitNumber: "7", labelJa: "7番出口", descriptionJa: "弘大の西側路地へ向かう出口です。夜のバーやクラブエリアへ移動しやすい位置です。", walkingTimeMin: 7, landmarkRefs: ["hongdae", "クラブ通り"] },
  { id: "exit_hongik-univ_8", stationId: "station_hongik-univ", exitNumber: "8", labelJa: "8番出口", descriptionJa: "バス停や大通りに近く、他エリアへ乗り継ぐ際に使いやすい出口です。", walkingTimeMin: 4, landmarkRefs: ["弘大入口バス停", "ヤンファ路"] },
  { id: "exit_hongik-univ_9", stationId: "station_hongik-univ", exitNumber: "9", labelJa: "9番出口", descriptionJa: "弘大・歩きたい通りのメインエリアへ最も行きやすい出口です。ストリート公演やカフェ、ショップが密集しています。", walkingTimeMin: 3, landmarkRefs: ["hongdae", "弘大歩きたい通り"] },

  { id: "exit_gangnam_1", stationId: "station_gangnam", exitNumber: "1", labelJa: "1番出口", descriptionJa: "江南駅北西側へ出る出口です。テヘラン路寄りのオフィス街へ向かうときに便利です。", walkingTimeMin: 5, landmarkRefs: ["テヘラン路", "オフィス街"] },
  { id: "exit_gangnam_2", stationId: "station_gangnam", exitNumber: "2", labelJa: "2番出口", descriptionJa: "江南大路西側の商業エリアへ出る出口です。飲食店やカフェが多く、待ち合わせにも向いています。", walkingTimeMin: 4, landmarkRefs: ["江南大路", "カフェ街"] },
  { id: "exit_gangnam_3", stationId: "station_gangnam", exitNumber: "3", labelJa: "3番出口", descriptionJa: "駅北側の繁華街に近い出口です。食堂や深夜営業の店舗へ行きやすい位置です。", walkingTimeMin: 4, landmarkRefs: ["gangnam", "飲食店街"] },
  { id: "exit_gangnam_4", stationId: "station_gangnam", exitNumber: "4", labelJa: "4番出口", descriptionJa: "江南駅西側ブロックへ出る出口で、地下商店街から地上へ上がりやすい動線です。", walkingTimeMin: 3, landmarkRefs: ["地下商店街", "gangnam"] },
  { id: "exit_gangnam_5", stationId: "station_gangnam", exitNumber: "5", labelJa: "5番出口", descriptionJa: "江南駅南西側へ出る出口です。新論峴方面へ徒歩移動する際の起点になります。", walkingTimeMin: 6, landmarkRefs: ["新論峴", "gangnam"] },
  { id: "exit_gangnam_6", stationId: "station_gangnam", exitNumber: "6", labelJa: "6番出口", descriptionJa: "江南の南側商圏へ出る出口で、レストランや雑貨店が集まる通りへ向かえます。", walkingTimeMin: 5, landmarkRefs: ["gangnam", "レストラン街"] },
  { id: "exit_gangnam_7", stationId: "station_gangnam", exitNumber: "7", labelJa: "7番出口", descriptionJa: "瑞草方面に近い出口です。比較的人混みを避けて移動したいときに使いやすい位置です。", walkingTimeMin: 5, landmarkRefs: ["瑞草", "江南駅南側"] },
  { id: "exit_gangnam_8", stationId: "station_gangnam", exitNumber: "8", labelJa: "8番出口", descriptionJa: "江南駅南東側へ出る出口です。周辺ホテルやオフィスビルへのアクセスに便利です。", walkingTimeMin: 4, landmarkRefs: ["ホテル街", "オフィスビル"] },
  { id: "exit_gangnam_9", stationId: "station_gangnam", exitNumber: "9", labelJa: "9番出口", descriptionJa: "江南駅東側の商業エリアへ出る出口です。ショッピングと食事をまとめて楽しみやすい場所です。", walkingTimeMin: 4, landmarkRefs: ["gangnam", "商業エリア"] },
  { id: "exit_gangnam_10", stationId: "station_gangnam", exitNumber: "10", labelJa: "10番出口", descriptionJa: "江南大路へそのまま出やすい出口です。バス乗換えや南北移動の目印として使いやすい位置です。", walkingTimeMin: 2, landmarkRefs: ["江南大路", "バス停"] },
  { id: "exit_gangnam_11", stationId: "station_gangnam", exitNumber: "11", labelJa: "11番出口", descriptionJa: "江南駅交差点のランドマーク的な出口です。初めてでも場所を把握しやすく、街歩きの基点に最適です。", walkingTimeMin: 2, landmarkRefs: ["gangnam", "江南駅四差路"] },
  { id: "exit_gangnam_12", stationId: "station_gangnam", exitNumber: "12", labelJa: "12番出口", descriptionJa: "東側の高層ビル街へ向かう出口です。オフィス訪問やテヘラン路方面の移動に便利です。", walkingTimeMin: 5, landmarkRefs: ["テヘラン路", "高層ビル街"] },

  { id: "exit_gyeongbokgung_1", stationId: "station_gyeongbokgung", exitNumber: "1", labelJa: "1番出口", descriptionJa: "政府ソウル庁舎や西村東側へ向かう出口です。比較的落ち着いた通りに出られます。", walkingTimeMin: 6, landmarkRefs: ["政府ソウル庁舎", "西村"] },
  { id: "exit_gyeongbokgung_2", stationId: "station_gyeongbokgung", exitNumber: "2", labelJa: "2番出口", descriptionJa: "景福宮駅西側の路地へ出る出口です。静かなカフェや食堂が点在するエリアに向かえます。", walkingTimeMin: 5, landmarkRefs: ["西村", "景福宮駅西側"] },
  { id: "exit_gyeongbokgung_3", stationId: "station_gyeongbokgung", exitNumber: "3", labelJa: "3番出口", descriptionJa: "西村方面の散策に便利な出口です。韓屋カフェやローカル食堂が多いエリアへ歩けます。", walkingTimeMin: 4, landmarkRefs: ["西村", "韓屋カフェ"] },
  { id: "exit_gyeongbokgung_4", stationId: "station_gyeongbokgung", exitNumber: "4", labelJa: "4番出口", descriptionJa: "国立古宮博物館や光化門広場方面へ向かう出口です。王宮観光を広げたいときに便利です。", walkingTimeMin: 6, landmarkRefs: ["国立古宮博物館", "光化門広場"] },
  { id: "exit_gyeongbokgung_5", stationId: "station_gyeongbokgung", exitNumber: "5", labelJa: "5番出口", descriptionJa: "景福宮の正門に最も近い出口です。宮殿観光の定番ルートにそのまま入れます。", walkingTimeMin: 3, landmarkRefs: ["gyeongbokgung", "景福宮正門"] },

  { id: "exit_jamsil_1", stationId: "station_jamsil", exitNumber: "1", labelJa: "1番出口", descriptionJa: "蚕室駅西側へ出る出口です。周辺ホテルや飲食店街へ歩きやすい位置です。", walkingTimeMin: 5, landmarkRefs: ["ホテル街", "飲食店街"] },
  { id: "exit_jamsil_2", stationId: "station_jamsil", exitNumber: "2", labelJa: "2番出口", descriptionJa: "ロッテワールドモール北側や展望台方面へ向かう出口です。大型商業施設へ入りやすい動線です。", walkingTimeMin: 4, landmarkRefs: ["ロッテワールドモール", "ソウルスカイ"] },
  { id: "exit_jamsil_3", stationId: "station_jamsil", exitNumber: "3", labelJa: "3番出口", descriptionJa: "石村湖方面の散策に便利な出口です。湖沿いの遊歩道やカフェへ歩いて行けます。", walkingTimeMin: 5, landmarkRefs: ["石村湖", "散歩道"] },
  { id: "exit_jamsil_4", stationId: "station_jamsil", exitNumber: "4", labelJa: "4番出口", descriptionJa: "ロッテワールドへ最も分かりやすく向かえる出口です。家族連れでも迷いにくい定番動線です。", walkingTimeMin: 2, landmarkRefs: ["jamsil-lotte-world", "ロッテワールド"] },
  { id: "exit_jamsil_10", stationId: "station_jamsil", exitNumber: "10", labelJa: "10番出口", descriptionJa: "蚕室総合運動場方面のバス停や南東側エリアへ出る出口です。イベント日の移動にも便利です。", walkingTimeMin: 6, landmarkRefs: ["バス停", "蚕室南東側"] },

  { id: "exit_seoul-station_1", stationId: "station_seoul-station", exitNumber: "1", labelJa: "1番出口", descriptionJa: "ソウル駅KTX乗り場や主要コンコースへ最も直結しやすい出口です。列車利用時の基点になります。", walkingTimeMin: 2, landmarkRefs: ["ソウル駅KTX", "ソウル駅コンコース"] },
  { id: "exit_seoul-station_2", stationId: "station_seoul-station", exitNumber: "2", labelJa: "2番出口", descriptionJa: "KORAIL本館や駅前タクシー乗り場方面へ出る出口です。長距離移動の乗継ぎに便利です。", walkingTimeMin: 3, landmarkRefs: ["KORAIL本館", "タクシー乗り場"] },
  { id: "exit_seoul-station_3", stationId: "station_seoul-station", exitNumber: "3", labelJa: "3番出口", descriptionJa: "空港鉄道・AREX方面の動線に近い出口です。空港へ向かう旅行者に使いやすい位置です。", walkingTimeMin: 4, landmarkRefs: ["AREX", "空港鉄道"] },
  { id: "exit_seoul-station_4", stationId: "station_seoul-station", exitNumber: "4", labelJa: "4番出口", descriptionJa: "ソウル駅西部のバス乗り場へ出やすい出口です。市内移動やホテルアクセスに便利です。", walkingTimeMin: 4, landmarkRefs: ["バス乗り場", "駅西側"] },
  { id: "exit_seoul-station_5", stationId: "station_seoul-station", exitNumber: "5", labelJa: "5番出口", descriptionJa: "ソウルスクエア方面へ向かう出口です。オフィス街やレストラン街へ移動しやすい場所です。", walkingTimeMin: 5, landmarkRefs: ["ソウルスクエア", "オフィス街"] },
  { id: "exit_seoul-station_6", stationId: "station_seoul-station", exitNumber: "6", labelJa: "6番出口", descriptionJa: "会賢・南大門寄りへ歩き始める際に便利な出口です。徒歩観光の起点として使えます。", walkingTimeMin: 8, landmarkRefs: ["会賢", "南大門"] },
  { id: "exit_seoul-station_7", stationId: "station_seoul-station", exitNumber: "7", labelJa: "7番出口", descriptionJa: "ロッテマート・ソウル駅店へ向かいやすい出口です。買い物前後の立ち寄りに便利です。", walkingTimeMin: 3, landmarkRefs: ["ロッテマート", "ソウル駅店"] },
  { id: "exit_seoul-station_8", stationId: "station_seoul-station", exitNumber: "8", labelJa: "8番出口", descriptionJa: "駅北西側の道路に面した出口です。混雑を避けて地上へ出たいときに使いやすい位置です。", walkingTimeMin: 4, landmarkRefs: ["駅北西側", "地上道路"] },
  { id: "exit_seoul-station_9", stationId: "station_seoul-station", exitNumber: "9", labelJa: "9番出口", descriptionJa: "ソウル路7017方面へ向かう出口です。高架歩道を使った散策を始めやすい位置です。", walkingTimeMin: 6, landmarkRefs: ["ソウル路7017", "高架歩道"] },
  { id: "exit_seoul-station_10", stationId: "station_seoul-station", exitNumber: "10", labelJa: "10番出口", descriptionJa: "ソウル駅東側のホテルエリアへ出る出口です。宿泊客の荷物移動にも向いています。", walkingTimeMin: 5, landmarkRefs: ["ホテルエリア", "駅東側"] },
  { id: "exit_seoul-station_11", stationId: "station_seoul-station", exitNumber: "11", labelJa: "11番出口", descriptionJa: "地下商店街経由で周辺ビルへ向かいやすい出口です。雨の日でも比較的移動しやすいです。", walkingTimeMin: 4, landmarkRefs: ["地下商店街", "周辺ビル"] },
  { id: "exit_seoul-station_12", stationId: "station_seoul-station", exitNumber: "12", labelJa: "12番出口", descriptionJa: "ソウル駅東広場方面へ出る出口です。バス停や待ち合わせ場所が多く便利です。", walkingTimeMin: 4, landmarkRefs: ["東広場", "バス停"] },
  { id: "exit_seoul-station_13", stationId: "station_seoul-station", exitNumber: "13", labelJa: "13番出口", descriptionJa: "崇礼門方面へ向かう出口です。歴史スポットやオフィス街へ徒歩で移動できます。", walkingTimeMin: 8, landmarkRefs: ["崇礼門", "オフィス街"] },
  { id: "exit_seoul-station_14", stationId: "station_seoul-station", exitNumber: "14", labelJa: "14番出口", descriptionJa: "南大門市場東側エリアへ歩きやすい出口です。市場散策を始める前の目印になります。", walkingTimeMin: 10, landmarkRefs: ["南大門市場", "市場東側"] },
  { id: "exit_seoul-station_15", stationId: "station_seoul-station", exitNumber: "15", labelJa: "15番出口", descriptionJa: "南大門市場方面へ向かう代表的な出口です。食べ歩きや買い物を目的にした徒歩移動に便利です。", walkingTimeMin: 11, landmarkRefs: ["南大門市場", "会賢"] },

  { id: "exit_anguk_1", stationId: "station_anguk", exitNumber: "1", labelJa: "1番出口", descriptionJa: "三清洞方面へ向かうのに便利な出口です。ギャラリーや静かなカフェ通りへ歩いて行けます。", walkingTimeMin: 5, landmarkRefs: ["samcheongdong", "三清洞"] },
  { id: "exit_anguk_2", stationId: "station_anguk", exitNumber: "2", labelJa: "2番出口", descriptionJa: "北村韓屋村の入口に最も近い出口です。坂道散策を始める旅行者によく使われます。", walkingTimeMin: 4, landmarkRefs: ["bukchon-hanok-village", "北村韓屋村"] },
  { id: "exit_anguk_3", stationId: "station_anguk", exitNumber: "3", labelJa: "3番出口", descriptionJa: "憲法裁判所や北村南側へ出る出口です。静かな街並みを歩きたいときに向いています。", walkingTimeMin: 5, landmarkRefs: ["憲法裁判所", "北村南側"] },
  { id: "exit_anguk_4", stationId: "station_anguk", exitNumber: "4", labelJa: "4番出口", descriptionJa: "安国駅西側の文化施設エリアへ出る出口です。小規模ギャラリー巡りにも便利です。", walkingTimeMin: 4, landmarkRefs: ["文化施設", "ギャラリー"] },
  { id: "exit_anguk_5", stationId: "station_anguk", exitNumber: "5", labelJa: "5番出口", descriptionJa: "仁寺洞北側へ向かう出口です。伝統茶カフェや工芸店が多い通りへつながります。", walkingTimeMin: 5, landmarkRefs: ["insadong", "伝統茶カフェ"] },
  { id: "exit_anguk_6", stationId: "station_anguk", exitNumber: "6", labelJa: "6番出口", descriptionJa: "仁寺洞メインストリートへ最も出やすい出口です。お土産探しや街歩きの起点に便利です。", walkingTimeMin: 3, landmarkRefs: ["insadong", "仁寺洞メインストリート"] },

  { id: "exit_dongdaemun_1", stationId: "station_dongdaemun", exitNumber: "1", labelJa: "1番出口", descriptionJa: "興仁之門北側へ出る出口です。城郭や周辺道路の景色を見ながら移動できます。", walkingTimeMin: 4, landmarkRefs: ["興仁之門", "城郭"] },
  { id: "exit_dongdaemun_2", stationId: "station_dongdaemun", exitNumber: "2", labelJa: "2番出口", descriptionJa: "東大門駅北西側へ出る出口です。鍾路5街方面へ歩くときに便利です。", walkingTimeMin: 5, landmarkRefs: ["鍾路5街", "東大門北西側"] },
  { id: "exit_dongdaemun_3", stationId: "station_dongdaemun", exitNumber: "3", labelJa: "3番出口", descriptionJa: "市場北側の衣料問屋エリアへ向かう出口です。昼間の買い付けや散策に向いています。", walkingTimeMin: 6, landmarkRefs: ["衣料問屋街", "dongdaemun-market"] },
  { id: "exit_dongdaemun_4", stationId: "station_dongdaemun", exitNumber: "4", labelJa: "4番出口", descriptionJa: "城郭公園や東側歩道へ出る出口です。比較的見通しのよい場所に出られます。", walkingTimeMin: 5, landmarkRefs: ["城郭公園", "東側歩道"] },
  { id: "exit_dongdaemun_5", stationId: "station_dongdaemun", exitNumber: "5", labelJa: "5番出口", descriptionJa: "東大門デザインプラザ方面へ徒歩移動しやすい出口です。イベント会場へ向かうときにも便利です。", walkingTimeMin: 8, landmarkRefs: ["DDP", "東大門デザインプラザ"] },
  { id: "exit_dongdaemun_6", stationId: "station_dongdaemun", exitNumber: "6", labelJa: "6番出口", descriptionJa: "東大門南側のファッションビル街へ向かう出口です。夜の買い物にも使いやすい位置です。", walkingTimeMin: 5, landmarkRefs: ["ファッションビル", "dongdaemun-market"] },
  { id: "exit_dongdaemun_7", stationId: "station_dongdaemun", exitNumber: "7", labelJa: "7番出口", descriptionJa: "清渓川方面へ歩きやすい出口です。市場周辺から散策ルートを広げたいときに便利です。", walkingTimeMin: 7, landmarkRefs: ["清渓川", "dongdaemun-market"] },
  { id: "exit_dongdaemun_8", stationId: "station_dongdaemun", exitNumber: "8", labelJa: "8番出口", descriptionJa: "東大門市場のメインエリアへ最も行きやすい出口です。ショッピングビルや屋台街へすぐ向かえます。", walkingTimeMin: 3, landmarkRefs: ["dongdaemun-market", "東大門市場"] },

  { id: "exit_itaewon_1", stationId: "station_itaewon", exitNumber: "1", labelJa: "1番出口", descriptionJa: "梨泰院メインストリートへ直接出られる代表的な出口です。各国料理店やバーが集まる中心街へすぐ向かえます。", walkingTimeMin: 2, landmarkRefs: ["itaewon", "梨泰院メインストリート"] },
  { id: "exit_itaewon_2", stationId: "station_itaewon", exitNumber: "2", labelJa: "2番出口", descriptionJa: "世界グルメ通りの東側へ出る出口です。食事目的の街歩きに向いています。", walkingTimeMin: 4, landmarkRefs: ["itaewon", "世界グルメ通り"] },
  { id: "exit_itaewon_3", stationId: "station_itaewon", exitNumber: "3", labelJa: "3番出口", descriptionJa: "ハミルトンホテルや駅前バス停に近い出口です。待ち合わせや乗換えに便利です。", walkingTimeMin: 3, landmarkRefs: ["ハミルトンホテル", "バス停"] },
  { id: "exit_itaewon_4", stationId: "station_itaewon", exitNumber: "4", labelJa: "4番出口", descriptionJa: "梨泰院南側の静かな路地へ出る出口です。坂道のカフェやレストランへ向かうときに便利です。", walkingTimeMin: 5, landmarkRefs: ["梨泰院南側", "カフェ路地"] },

  { id: "exit_samseong_1", stationId: "station_samseong", exitNumber: "1", labelJa: "1番出口", descriptionJa: "テヘラン路北側へ出る出口です。オフィス訪問や周辺ホテルへの移動に便利です。", walkingTimeMin: 5, landmarkRefs: ["テヘラン路", "ホテル"] },
  { id: "exit_samseong_2", stationId: "station_samseong", exitNumber: "2", labelJa: "2番出口", descriptionJa: "現代百貨店方面へ歩きやすい出口です。買い物や軽食に立ち寄りやすい位置です。", walkingTimeMin: 4, landmarkRefs: ["現代百貨店", "商業施設"] },
  { id: "exit_samseong_3", stationId: "station_samseong", exitNumber: "3", labelJa: "3番出口", descriptionJa: "駅西側のビジネス街へ向かう出口です。比較的直線的な動線で移動できます。", walkingTimeMin: 5, landmarkRefs: ["ビジネス街", "駅西側"] },
  { id: "exit_samseong_4", stationId: "station_samseong", exitNumber: "4", labelJa: "4番出口", descriptionJa: "都心空港ターミナルや大型ビル方面へ向かう出口です。荷物があるときにも使いやすい位置です。", walkingTimeMin: 6, landmarkRefs: ["都心空港ターミナル", "大型ビル"] },
  { id: "exit_samseong_5", stationId: "station_samseong", exitNumber: "5", labelJa: "5番出口", descriptionJa: "COEX東側施設や展示場周辺へ向かう出口です。イベント参加時の移動に便利です。", walkingTimeMin: 4, landmarkRefs: ["coex", "展示場"] },
  { id: "exit_samseong_6", stationId: "station_samseong", exitNumber: "6", labelJa: "6番出口", descriptionJa: "COEXモールへ最も分かりやすく向かえる出口です。水族館や書店、ショッピングモールへそのままアクセスできます。", walkingTimeMin: 2, landmarkRefs: ["coex", "COEXモール"] },
];

export default {
  EXITS,
};
