/* eslint-disable max-lines */

import ApexCharts from 'apexcharts';
import api from '../lib/axios';

// 生成最近7天的日期
const getLast7Days = () => {
	const dates = [];
	for (let i = 6; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		dates.push(date.toISOString().split('T')[0]); // 格式: YYYY-MM-DD
	}
	console.log(dates);
	
	return dates;
};

// 预定义的颜色集合
const colorPool = ['#99A7C0', '#808284', '#70706E', '#C0C8C0', '#91A08E','#647489','#7A8A98','#D0D0D0','#E0E0D0','#76846A'];

// 添加类型定义
interface ApiResponse {
	id: number;
	code: number;
	data: {
		[key: string]: {
			[date: string]: number;
		};
	};
	total: number | null;
	message: string;
}

interface ProcessedData {
	softwareList: {
		name: string;
		values: number[];
		color: string;
	}[];
	dates: string[];
}

// 修改 fetchOnlineCount 函数
const fetchOnlineCount = async (): Promise<ProcessedData> => {
	try {
		const response = await api<ApiResponse>({
			method: 'get',
			url: '/api/dev/last7days'
		});

		if (response.data.code === 200) {
			// 获取最近7天的日期
			const dates = getLast7Days();
			
			// 处理每个软件的数据
			const softwareList = Object.entries(response.data.data).map(([name, dateData], index) => {
				// 对每一天进行检查，如果没有数据则填充0
				const values = dates.map(date => dateData[date] || 0);
				
				return {
					name,
					values,
					color: colorPool[index % colorPool.length] // 循环使用颜色池中的颜色
				};
			});

			return {
				softwareList,
				dates
			};
		} else {
			throw new Error(response.data.message || '请求失败');
		}
	} catch (error) {
		console.error('获取数据失败:', error);
		// 返回空数据结构
		return {
			softwareList: [],
			dates: getLast7Days()
		};
	}
};

// 修改 getMainChartOptions 函数中的数据获取部分
const getMainChartOptions = async () => {
	let mainChartColors = {};

	if (document.documentElement.classList.contains('dark')) {
		mainChartColors = {
			borderColor: '#374151',
			labelColor: '#9CA3AF',
			opacityFrom: 0,
			opacityTo: 0.15,
		};
	} else {
		mainChartColors = {
			borderColor: '#F3F4F6',
			labelColor: '#6B7280',
			opacityFrom: 0.45,
			opacityTo: 0,
		};
	}

	// 预定义的颜色集合
	const colorPool = ['#99A7C0', '#808284', '#70706E', '#C0C8C0', '#91A08E','#647489','#7A8A98','#D0D0D0','#E0E0D0','#76846A'];
	
	// 生成最近7天的日期
	const getLast7Days = () => {
		const dates = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			dates.push(date.toISOString().split('T')[0]); // 格式: YYYY-MM-DD
		}
	
		return dates;
	};

	// 获取数据
	const data = await fetchOnlineCount();
	
	return {
		chart: {
			height: 420,
			type: 'area',
			fontFamily: 'Inter, sans-serif',
			foreColor: mainChartColors.labelColor,
			toolbar: {
				show: false,
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				enabled: true,
				opacityFrom: mainChartColors.opacityFrom,
				opacityTo: mainChartColors.opacityTo,
			},
		},
		dataLabels: {
			enabled: false,
		},
		tooltip: {
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
			y: {
				formatter: function(value) {
					return value.toString();
				}
			}
		},
		grid: {
			show: true,
			borderColor: mainChartColors.borderColor,
			strokeDashArray: 1,
			padding: {
				left: 35,
				bottom: 15,
			},
		},
		series: data.softwareList.map(software => ({
			name: software.name,
			data: software.values,
			color: software.color
		})),
		markers: {
			size: 5,
			strokeColors: '#ffffff',
			hover: {
				size: undefined,
				sizeOffset: 3,
			},
		},
		xaxis: {
			categories: data.dates,
			labels: {
				style: {
					colors: [mainChartColors.labelColor],
					fontSize: '14px',
					fontWeight: 500,
				},
			},
			axisBorder: {
				color: mainChartColors.borderColor,
			},
			axisTicks: {
				color: mainChartColors.borderColor,
			},
			crosshairs: {
				show: true,
				position: 'back',
				stroke: {
					color: mainChartColors.borderColor,
					width: 1,
					dashArray: 10,
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: [mainChartColors.labelColor],
					fontSize: '14px',
					fontWeight: 500,
				},
				formatter: function(value) {
					return value.toString();
				},
			},
		},
		legend: {
			fontSize: '14px',
			fontWeight: 500,
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: [mainChartColors.labelColor],
			},
			itemMargin: {
				horizontal: 10,
			},
		},
		responsive: [
			{
				breakpoint: 1024,
				options: {
					xaxis: {
						labels: {
							show: false,
						},
					},
				},
			},
		],
	};
};

// 修改图表初始化部分
if (document.getElementById('main-chart')) {
	const initChart = async () => {
		const options = await getMainChartOptions();
		const chart = new ApexCharts(
			document.getElementById('main-chart'),
			options
		);
		await chart.render();

		// 初始化暗色模式切换
		document.addEventListener('dark-mode', async () => {
			const newOptions = await getMainChartOptions();
			await chart.updateOptions(newOptions);
		});
	};

	initChart().catch(console.error);
}

if (document.getElementById('new-products-chart')) {
	const options = {
		colors: ['#1A56DB', '#FDBA8C'],
		series: [
			{
				name: '软件A',
				color: '#1A56DB', 
				data: [
					{ x: '2024-01-24', y: 32 },
					{ x: '2024-01-25', y: 45 },
					{ x: '2024-01-26', y: 18 },
					{ x: '2024-01-27', y: 27 },
					{ x: '2024-01-28', y: 41 },
					{ x: '2024-01-29', y: 15 },
					{ x: '2024-01-30', y: 38 },
				],
			},
		],
		chart: {
			type: 'bar',
			height: '140px',
			fontFamily: 'Inter, sans-serif',
			foreColor: '#4B5563',
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				columnWidth: '90%',
				borderRadius: 3,
			},
		},
		tooltip: {
			shared: false,
			intersect: false,
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 1,
				},
			},
		},
		stroke: {
			show: true,
			width: 5,
			colors: ['transparent'],
		},
		grid: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		xaxis: {
			floating: false,
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			show: false,
		},
		fill: {
			opacity: 1,
		},
	};

	const chart = new ApexCharts(
		document.getElementById('new-products-chart'),
		options,
	);
	chart.render();
}

if (document.getElementById('sales-by-category')) {
	const options = {
		colors: ['#1A56DB', '#FDBA8C'],
		series: [
			{
				name: 'Desktop PC',
				color: '#1A56DB',
				data: [
					{ x: '01 Feb', y: 170 },
					{ x: '02 Feb', y: 180 },
					{ x: '03 Feb', y: 164 },
					{ x: '04 Feb', y: 145 },
					{ x: '05 Feb', y: 194 },
					{ x: '06 Feb', y: 170 },
					{ x: '07 Feb', y: 155 },
				],
			},
			{
				name: 'Phones',
				color: '#FDBA8C',
				data: [
					{ x: '01 Feb', y: 120 },
					{ x: '02 Feb', y: 294 },
					{ x: '03 Feb', y: 167 },
					{ x: '04 Feb', y: 179 },
					{ x: '05 Feb', y: 245 },
					{ x: '06 Feb', y: 182 },
					{ x: '07 Feb', y: 143 },
				],
			},
			{
				name: 'Gaming/Console',
				color: '#17B0BD',
				data: [
					{ x: '01 Feb', y: 220 },
					{ x: '02 Feb', y: 194 },
					{ x: '03 Feb', y: 217 },
					{ x: '04 Feb', y: 279 },
					{ x: '05 Feb', y: 215 },
					{ x: '06 Feb', y: 263 },
					{ x: '07 Feb', y: 183 },
				],
			},
		],
		chart: {
			type: 'bar',
			height: '420px',
			fontFamily: 'Inter, sans-serif',
			foreColor: '#4B5563',
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				columnWidth: '90%',
				borderRadius: 3,
			},
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 1,
				},
			},
		},
		stroke: {
			show: true,
			width: 5,
			colors: ['transparent'],
		},
		grid: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		xaxis: {
			floating: false,
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			show: false,
		},
		fill: {
			opacity: 1,
		},
	};

	const chart = new ApexCharts(
		document.getElementById('sales-by-category'),
		options,
	);
	chart.render();
}

const getVisitorsChartOptions = () => {
	let visitorsChartColors = {};

	if (document.documentElement.classList.contains('dark')) {
		visitorsChartColors = {
			fillGradientShade: 'dark',
			fillGradientShadeIntensity: 0.45,
		};
	} else {
		visitorsChartColors = {
			fillGradientShade: 'light',
			fillGradientShadeIntensity: 1,
		};
	}

	return {
		series: [
			{
				name: 'Visitors',
				data: [500, 590, 600, 520, 610, 550, 600],
			},
		],
		labels: [
			'01 Feb',
			'02 Feb',
			'03 Feb',
			'04 Feb',
			'05 Feb',
			'06 Feb',
			'07 Feb',
		],
		chart: {
			type: 'area',
			height: '305px',
			fontFamily: 'Inter, sans-serif',
			sparkline: {
				enabled: true,
			},
			toolbar: {
				show: false,
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: visitorsChartColors.fillGradientShade,
				shadeIntensity: visitorsChartColors.fillGradientShadeIntensity,
			},
		},
		plotOptions: {
			area: {
				fillTo: 'end',
			},
		},
		theme: {
			monochrome: {
				enabled: true,
				color: '#1A56DB',
			},
		},
		tooltip: {
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
		},
	};
};

const getSignupsChartOptions = () => {
	let signupsChartColors = {};

	if (document.documentElement.classList.contains('dark')) {
		signupsChartColors = {
			backgroundBarColors: [
				'#374151',
				'#374151',
				'#374151',
				'#374151',
				'#374151',
				'#374151',
				'#374151',
			],
		};
	} else {
		signupsChartColors = {
			backgroundBarColors: [
				'#E5E7EB',
				'#E5E7EB',
				'#E5E7EB',
				'#E5E7EB',
				'#E5E7EB',
				'#E5E7EB',
				'#E5E7EB',
			],
		};
	}

	return {
		series: [
			{
				name: 'Users',
				data: [1334, 2435, 1753, 1328, 1155, 1632, 1336],
			},
		],
		labels: [
			'01 Feb',
			'02 Feb',
			'03 Feb',
			'04 Feb',
			'05 Feb',
			'06 Feb',
			'07 Feb',
		],
		chart: {
			type: 'bar',
			height: '140px',
			foreColor: '#4B5563',
			fontFamily: 'Inter, sans-serif',
			toolbar: {
				show: false,
			},
		},
		theme: {
			monochrome: {
				enabled: true,
				color: '#1A56DB',
			},
		},
		plotOptions: {
			bar: {
				columnWidth: '25%',
				borderRadius: 3,
				colors: {
					backgroundBarColors: signupsChartColors.backgroundBarColors,
					backgroundBarRadius: 3,
				},
			},
			dataLabels: {
				hideOverflowingLabels: false,
			},
		},
		xaxis: {
			floating: false,
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 0.8,
				},
			},
		},
		fill: {
			opacity: 1,
		},
		yaxis: {
			show: false,
		},
		grid: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
	};
};

if (document.getElementById('week-signups-chart')) {
	const chart = new ApexCharts(
		document.getElementById('week-signups-chart'),
		getSignupsChartOptions(),
	);
	chart.render();

	// init again when toggling dark mode
	document.addEventListener('dark-mode', () => {
		chart.updateOptions(getSignupsChartOptions());
	});
}

const getTrafficChannelsChartOptions = () => {
	let trafficChannelsChartColors = {};

	if (document.documentElement.classList.contains('dark')) {
		trafficChannelsChartColors = {
			strokeColor: '#1f2937',
		};
	} else {
		trafficChannelsChartColors = {
			strokeColor: '#ffffff',
		};
	}

	return {
		series: [70, 5, 25],
		labels: ['Desktop', 'Tablet', 'Phone'],
		colors: ['#16BDCA', '#FDBA8C', '#1A56DB'],
		chart: {
			type: 'donut',
			height: 400,
			fontFamily: 'Inter, sans-serif',
			toolbar: {
				show: false,
			},
		},
		responsive: [
			{
				breakpoint: 430,
				options: {
					chart: {
						height: 300,
					},
				},
			},
		],
		stroke: {
			colors: [trafficChannelsChartColors.strokeColor],
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 0.9,
				},
			},
		},
		tooltip: {
			shared: true,
			followCursor: false,
			fillSeriesColor: false,
			inverseOrder: true,
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
			x: {
				show: true,
				formatter(_, { seriesIndex, w }) {
					const label = w.config.labels[seriesIndex];
					return label;
				},
			},
			y: {
				formatter(value) {
					return `${value}%`;
				},
			},
		},
		grid: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
	};
};

if (document.getElementById('traffic-by-device')) {
	const chart = new ApexCharts(
		document.getElementById('traffic-by-device'),
		getTrafficChannelsChartOptions(),
	);
	chart.render();

	// init again when toggling dark mode
	document.addEventListener('dark-mode', () => {
		chart.updateOptions(getTrafficChannelsChartOptions());
	});
}

function initDocViewer() {
	document.querySelectorAll('.upload-btn').forEach(button => {
			button.addEventListener('click', () => {
					const docPath = button.dataset.docPath;
					const docTitle = button.dataset.docTitle;
					
					window.dispatchEvent(new CustomEvent('show-doc', { 
							detail: {
									path: docPath,
									title: docTitle
							}
					}));
			});
	});
}

document.addEventListener('DOMContentLoaded', initDocViewer);
