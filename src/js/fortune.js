/**
 * MODULE 4: FORTUNE (V13.0)
 * 姓名判断エンジン
 */

const FortuneLogic = (function() {
    const getGogyo = (num) => {
        const n = num % 10;
        if (n === 1 || n === 2) return { name: "木", type: "Wood" };
        if (n === 3 || n === 4) return { name: "火", type: "Fire" };
        if (n === 5 || n === 6) return { name: "土", type: "Earth" };
        if (n === 7 || n === 8) return { name: "金", type: "Metal" };
        return { name: "水", type: "Water" };
    };

    const getSansaiLuck = (ten, jin, chi) => {
        const t = getGogyo(ten).name;
        const j = getGogyo(jin).name;
        const c = getGogyo(chi).name;

        const sosei = ["木火", "火土", "土金", "金水", "水木", "木木", "火火", "土土", "金金", "水水"];
        const isTenJinGood = sosei.includes(t + j) || sosei.includes(j + t);
        const isJinChiGood = sosei.includes(j + c) || sosei.includes(c + j);

        if (isTenJinGood && isJinChiGood) {
            return { l: "大吉", desc: "三才の配置が完璧です。" };
        } else if (isTenJinGood || isJinChiGood) {
            return { l: "吉", desc: "良好なバランスです。" };
        } else {
            return { l: "中吉", desc: "独自の個性が光る配置です。" };
        }
    };

    const luckData = {
        1: { l: "大吉", r: "万物始動数" },
        3: { l: "大吉", r: "希望発展数" },
        5: { l: "大吉", r: "福寿円満数" },
        6: { l: "大吉", r: "天徳守護数" },
        11: { l: "大吉", r: "再興発展数" },
        13: { l: "大吉", r: "才知明敏数" },
        15: { l: "大吉", r: "徳望円満数" },
        16: { l: "大吉", r: "衆望貴人数" },
        21: { l: "大吉", r: "独立頭領数" },
        23: { l: "大吉", r: "旭日昇天数" },
        24: { l: "大吉", r: "金運興産数" },
        31: { l: "大吉", r: "智仁勇兼備数" },
        32: { l: "大吉", r: "僥倖幸運数" },
        33: { l: "大吉", r: "威権猛烈数" }
    };

    const defaultLuck = { l: "中吉", r: "安定した運勢" };

    return {
        calculate: function(surArr, givArr) {
            const surStrokes = surArr.map(s => s.strokes);
            const givStrokes = givArr.map(g => g.strokes);

            const surTotal = surStrokes.reduce((a, b) => a + b, 0);
            const givTotal = givStrokes.reduce((a, b) => a + b, 0);

            const ten = surTotal;
            const jin = surStrokes[surStrokes.length - 1] + givStrokes[0];
            const chi = givTotal;
            
            let gai = (surTotal + givTotal) - jin;
            if (surStrokes.length === 1 && givStrokes.length === 1) gai = 2;
            else if (surStrokes.length === 1 || givStrokes.length === 1) gai += 1;

            const so = surTotal + givTotal;

            const sansai = getSansaiLuck(ten, jin, chi);

            return {
                ten: this.wrap(ten, "【天格】祖先より受け継いだ運勢"),
                jin: this.wrap(jin, "【人格】人生の主軸"),
                chi: this.wrap(chi, "【地格】若年期の運勢"),
                gai: this.wrap(gai, "【外格】対人・社会運"),
                so: this.wrap(so, "【総格】晩年の運勢"),
                sansai: {
                    label: sansai.l,
                    desc: sansai.desc,
                    t: getGogyo(ten).name,
                    j: getGogyo(jin).name,
                    c: getGogyo(chi).name
                }
            };
        },

        wrap: function(val, role) {
            const targetVal = val > 81 ? (val % 81 || 81) : val;
            const luck = luckData[targetVal] || defaultLuck;
            
            let colorClass = "text-[#bca37f]";
            if (luck.l === "大吉") colorClass = "text-amber-600 font-black";

            return {
                val: val,
                num: val,
                res: { label: luck.l, color: colorClass },
                role: role + " " + luck.r
            };
        }
    };
})();

console.log("MODULE_FORTUNE: V13.0 Loaded");
