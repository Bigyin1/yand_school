import {Chart} from 'chart.js';

function getColor(isActive, alpha = 1) {
    return isActive
        ? `rgba(54, 162, 235, ${alpha})`
        : `rgba(255, 99, 132, ${alpha})`;
}

function getLabel(el, i, data) {
    const x = new Date();
    x.setHours(x.getHours() - data.length + i);
    x.setMinutes(0);
    x.setSeconds(0);
    x.setMilliseconds(0);
    return x.toString().substring(0, 34) //Срез для того чтобы убрать (Москва, стандартное время) ;
}

export function createChart(container, data, isActive) {
    const ctx = container.getContext('2d');

    const borderColor = getColor(isActive);
    const backgroundColor = getColor(isActive, 0.5);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(getLabel),
            datasets: [
                {
                    label: 'Загрузка',
                    data: data,
                    borderWidth: 1,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{ticks: {display: false}}],
                yAxes: [{ticks: {beginAtZero: true, max: 10}}] // максимум по y, изначально было 0
            },
            layout: {
                padding: {
                    right: 30 // чарты немного некорректно отображаются в балуне и этот отступ нужен чтобы правая
                            // часть чарта не обрезалась
                },
            }

        }
    });

    return chart;
}
