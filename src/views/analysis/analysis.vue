<template>
    <div class="warpper">
        <div id="Piecharts" style="height: 450px;"></div>
        <div id="Radarcharts" style="height: 300px;"></div>
    </div>
</template>

<script>
import { getAnalysisData } from '../../api/analysis'

export default {
    name: 'analysis',
    data() {
        return {
            piedata: [
                {
                    name: "手机通讯",
                    value: 40
                },
                {
                    name: "电脑整机",
                    value: 25
                },
                {
                    name: "黄金首饰",
                    value: 10
                },
                {
                    name: "钻石彩宝",
                    value: 25
                },
                {
                    name: "面部护理",
                    value: 10
                }
            ],
            radardata: {
                indicator: [
                    { name: '2022-10月', max: 15597 },
                    { name: '2022-11月', max: 600 },
                    { name: '2021-12月', max: 3590 },
                    { name: '2022-01月', max: 11780 },
                    { name: '2022-02月', max: 7400 },
                    { name: '2022-03月', max: 6400 },
                    { name: '2022-04月', max: 4280 },
                    { name: '2022-09月', max: 2099 },
                    { name: '2022-08月', max: 4280 },
                    { name: '2022-07月', max: 6400 },
                    { name: '2022-06月', max: 2999 },
                    { name: '2022-05月', max: 5450 }
                ],
                data: [
                    {
                        value: [
                            14997, 0, 2990, 11180, 6800, 5800, 3680, 1499, 3680, 5800, 2399, 4850
                        ],
                        areaStyle: {
                            color: "rgb(42,242,272,.3)"
                        },
                        label: {
                            show: true
                        }
                    }
                ]
            }
        }
    },
    mounted() {
        this.initDom()
        getAnalysisData().then(res => {
            if (res.code == 200) {
                this.piedata = res.data.piedata
                this.radardata = res.data.radardata
            }
        })
    },
    methods: {
        // 初始化dom
        initDom() {
            // 初始化基站
            const piedom = this.$echarts.init(document.getElementById('Piecharts'));
            const radardom = this.$echarts.init(document.getElementById('Radarcharts'));

            const pieChartsOpstion = {
                title: {
                    text: "分类消费统计",
                    subtext: "本年度统计",
                    textStyle: {
                        color: "#fff"
                    },
                    subtextStyle: {
                        color: "#fff"
                    },
                    left: "center"
                },
                series: {
                    type: "pie",
                    radius: "50%",
                    data: this.piedata
                },
                legend: {
                    show: true,
                    orient: '',
                    left: 0,
                    textStyle: {
                        color: "#fff"
                    }
                }
            }
            const radarChartsOption = {
                title: {
                    text: "本年度消费记录",
                    textStyle: {
                        color: "#fff",
                    }
                },
                radar: {
                    radius: "68%",
                    indicator: this.radardata.indicator,
                },
                series: {
                    type: "radar",
                    splitNumber: 5,
                    symbolSize: 5,
                    data: this.radardata.data
                }
            }
            radardom.setOption(radarChartsOption);
            piedom.setOption(pieChartsOpstion);
            console.log(piedom, radardom);
        }
    }
}
</script>

<style scoped>
.warpper {
    width: 100vw;
    height: calc(100vh - 96px);
    background-color: rgb(4, 4, 42);
}
</style>
