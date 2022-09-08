# 平均绩点计算说明

1. 点击进入 [研究生教育管理系统](http://fw.yjs.zjut.edu.cn/), 登录个人账号（推荐谷歌浏览器、Edge浏览器）
2. 在成绩查询页面 **右键** 点击 **检查**（即开发者模式），再点击 **控制台**（Console）

![](https://github.com/jinzcdev/zjut-postgraduate-gpa-computing/blob/main/imgs/console.png)

3. 复制附页中的代码并 **按下回车** 自动下载计算结果


```js
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
```



![](https://github.com/jinzcdev/zjut-postgraduate-gpa-computing/blob/main/imgs/code.png)

![](https://github.com/jinzcdev/zjut-postgraduate-gpa-computing/blob/main/imgs/download.png)



# 免责申明

导出结果仅供参考，真实结果以本人计算结果为准。