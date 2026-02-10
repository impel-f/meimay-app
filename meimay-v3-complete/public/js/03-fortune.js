/* ============================================================
   MODULE 03: FORTUNE (V13.0)
   姓名判断ロジック（五格・三才・五行）
   ============================================================ */

const FortuneLogic = (function() {
    
    /**
     * 五行の取得（末尾数字から判定）
     */
    const getGogyo = (num) => {
        const n = num % 10;
        if (n === 1 || n === 2) return { name: "木", type: "Wood" };
        if (n === 3 || n === 4) return { name: "火", type: "Fire" };
        if (n === 5 || n === 6) return { name: "土", type: "Earth" };
        if (n === 7 || n === 8) return { name: "金", type: "Metal" };
        return { name: "水", type: "Water" };
    };

    /**
     * 三才の相性判定
     */
    const getSansaiLuck = (ten, jin, chi) => {
        const t = getGogyo(ten).name;
        const j = getGogyo(jin).name;
        const c = getGogyo(chi).name;

        // 相生関係（良い組み合わせ）
        const sosei = [
            "木火", "火土", "土金", "金水", "水木", // 相生
            "木木", "火火", "土土", "金金", "水水"  // 同行
        ];
        
        const isTenJinGood = sosei.includes(t + j) || sosei.includes(j + t);
        const isJinChiGood = sosei.includes(j + c) || sosei.includes(c + j);

        if (isTenJinGood && isJinChiGood) {
            return { l: "大吉", desc: "三才の配置が完璧です。バランスの取れた運勢。" };
        } else if (isTenJinGood || isJinChiGood) {
            return { l: "吉", desc: "良好なバランスです。安定した運勢。" };
        } else {
            return { l: "中吉", desc: "独自の個性が光る配置です。努力次第で開運。" };
        }
    };

    /**
     * 画数別の吉凶データ
     */
    const luckData = {
        1: { l: "大吉", r: "万物始動数。リーダー気質" },
        3: { l: "大吉", r: "希望発展数。明るい未来" },
        5: { l: "大吉", r: "福寿円満数。調和と平和" },
        6: { l: "大吉", r: "天徳守護数。人徳に恵まれる" },
        7: { l: "吉", r: "独立突破数。独創的な発想" },
        8: { l: "吉", r: "不撓不屈数。粘り強さ" },
        11: { l: "大吉", r: "再興発展数。再起の力" },
        13: { l: "大吉", r: "才知明敏数。聡明な知性" },
        15: { l: "大吉", r: "徳望円満数。温和な人柄" },
        16: { l: "大吉", r: "衆望貴人数。人望を集める" },
        17: { l: "吉", r: "意志強固数。強い意志力" },
        18: { l: "吉", r: "権威成功数。統率力に優れる" },
        21: { l: "大吉", r: "独立頭領数。指導者の資質" },
        23: { l: "大吉", r: "旭日昇天数。運気上昇" },
        24: { l: "大吉", r: "金運興産数。財を成す" },
        25: { l: "吉", r: "聡明誠実数。誠実な性格" },
        29: { l: "吉", r: "知謀才略数。戦略的思考" },
        31: { l: "大吉", r: "智仁勇兼備数。三拍子揃う" },
        32: { l: "大吉", r: "僥倖幸運数。幸運に恵まれる" },
        33: { l: "大吉", r: "威権猛烈数。強いリーダーシップ" },
        35: { l: "大吉", r: "文芸平和数。芸術的才能" },
        37: { l: "吉", r: "信義誠実数。信頼される人" },
        39: { l: "大吉", r: "富貴繁栄数。繁栄を築く" },
        41: { l: "大吉", r: "剛毅果断数。決断力に優れる" },
        45: { l: "大吉", r: "順風満帆数。順調な人生" },
        47: { l: "大吉", r: "開花結実数。努力が実る" },
        48: { l: "大吉", r: "有徳軍師数。知恵と徳" },
        52: { l: "大吉", r: "先見明察数。先を見通す力" },
        57: { l: "吉", r: "寒雪青松数。困難に強い" },
        63: { l: "大吉", r: "吉祥安泰数。安泰な人生" },
        65: { l: "大吉", r: "巨富栄達数。大きな成功" },
        67: { l: "吉", r: "順風満帆数。運気良好" },
        68: { l: "吉", r: "発明知恵数。創造力豊か" },
        81: { l: "大吉", r: "還源成功数。円満な完成" }
    };

    const defaultLuck = { l: "中吉", r: "努力次第で安定した運勢" };

    /**
     * メイン計算関数
     */
    return {
        calculate: function(surArr, givArr) {
            if (!surArr || surArr.length === 0) {
                console.warn("FORTUNE: Surname data is empty");
                surArr = [{ kanji: '', strokes: 0 }];
            }
            
            if (!givArr || givArr.length === 0) {
                console.error("FORTUNE: Given name data is empty");
                return null;
            }

            const surStrokes = surArr.map(s => s.strokes);
            const givStrokes = givArr.map(g => g.strokes);
            const surTotal = surStrokes.reduce((a, b) => a + b, 0);
            const givTotal = givStrokes.reduce((a, b) => a + b, 0);

            // 五格の計算
            const ten = surTotal || 1; // 天格（名字の総画数）
            const jin = (surStrokes[surStrokes.length - 1] || 0) + (givStrokes[0] || 0); // 人格
            const chi = givTotal; // 地格（名前の総画数）
            
            // 外格の計算
            let gai = (surTotal + givTotal) - jin;
            if (surStrokes.length === 1 && givStrokes.length === 1) {
                gai = 2; // 特殊ケース
            } else if (surStrokes.length === 1 || givStrokes.length === 1) {
                gai += 1; // 調整
            }

            const so = surTotal + givTotal; // 総格
            
            // 三才の判定
            const sansai = getSansaiLuck(ten, jin, chi);

            return {
                ten: this.wrap(ten, "【天格】祖先運"),
                jin: this.wrap(jin, "【人格】主運"),
                chi: this.wrap(chi, "【地格】初年運"),
                gai: this.wrap(gai, "【外格】対人運"),
                so: this.wrap(so, "【総格】総合運"),
                sansai: {
                    label: sansai.l,
                    desc: sansai.desc,
                    t: getGogyo(ten).name,
                    j: getGogyo(jin).name,
                    c: getGogyo(chi).name
                }
            };
        },

        /**
         * 画数を吉凶でラップ
         */
        wrap: function(val, role) {
            const targetVal = val > 81 ? (val % 81 || 81) : val;
            const luck = luckData[targetVal] || defaultLuck;
            
            let colorClass = "text-[#bca37f]";
            if (luck.l === "大吉") colorClass = "text-amber-600 font-black";
            else if (luck.l === "吉") colorClass = "text-[#81c995] font-bold";
            else if (luck.l === "凶") colorClass = "text-slate-500 font-bold";

            return {
                val: val,
                res: { label: luck.l, color: colorClass },
                role: role + " " + luck.r
            };
        }
    };
})();

console.log("FORTUNE: Module loaded");
