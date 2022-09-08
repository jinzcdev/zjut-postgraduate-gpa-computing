$.ajax({
    type: "POST",
    url: "http://fw.yjs.zjut.edu.cn/gsapp/sys/wdcjapp/modules/wdcj/xscjcx.do",
    data: "pageSize=30&pageNumber=1",
    dataType: "json",
    success: function (response) {
        const rows = response.datas.xscjcx.rows;
        var sum_degree = 0, sum_non_degree = 0, sum = 0;
        const items = [], header = "课程,课程类别,分数,绩点,学分";

        for (let i = 0; i < rows.length; i++) {
            const e = rows[i];
            var gp = 0.0;
            switch (e["CJXSZ"]) {
                case "优秀": gp = 4.5; break;
                case "良好": gp = 3.5; break;
                case "中等": gp = 2.5; break;
                case "及格": gp = 1.5; break;
                case "不及格": gp = 0.0; break;
                default:
                    const score = parseFloat(e["CJXSZ"]);
                    gp = score >= 60 ? (score - 50) / 10 : 0;
            }
            const credit = e["XF"];
            if (e["KCLBMC"] == "学位") {
                sum += credit * gp * 0.7;
                sum_degree += credit;
            } else {
                sum += credit * gp * 0.3;
                sum_non_degree += credit;
            }
            items.push([e["KCMC"], e["KCLBMC"], e["CJXSZ"], gp, credit]);
        }
        items.sort((a, b) => a[1] == "学位" ? -1 : 1);
        const result = `${header}\r\n` + items.map(e => e.join(",")).join("\r\n") +
            `\r\n平均绩点:,${sum / (sum_degree * 0.7 + sum_non_degree * 0.3)}`
        var blob = new Blob(["\uFEFF" + result], { type: 'text/csv;charset=utf-8;' });
        var a = document.createElement('a');
        a.download = "result.csv";
        a.href = URL.createObjectURL(blob);
        a.click();
    }
});
