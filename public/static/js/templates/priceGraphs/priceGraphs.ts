import { properDate } from '../../modules/utilsFunctions';
import { templateFunc } from '../../types';
import xlabelT from './xlabel.handlebars';
import ylabelT from './ylabel.handlebars';
import graphT from './priceGraphs.handlebars';
import './priceGraphs.sass';


export function drawGraphs(x: string[], y: number[]) {
    shortenDate(x, y);
    console.log(x.length)
    // не рисуем графики если цена не менялась
    if (x.length <= 1) {
        return;
    }
    const graphContainer = document.createElement('div');
    graphContainer.classList.add('price-history-container');
    
    const graphDate = setAndConvertData(convertDateToNum(x), y)

    graphContainer.innerHTML = (<templateFunc>graphT)({priceDiv: window.localizer.getLocaleItem('priceDiv')});

    const plot = graphContainer.querySelector('.price-history_plot');
    const xlabel = graphContainer.querySelector('.price-history_axe-x_label-container');
    const xChert = graphContainer.querySelector('.price-history_axe-x_chert-container');
    // заполняем горизонталь
    x.forEach((element, i) => {
        const date = properDate((<string><unknown>element).slice(0, 10)).slice(0, 6);
        const xlabelElement = document.createElement('div');
        const chertElement = document.createElement('div');
        chertElement.classList.add('price-history_axe-x_chert');
        chertElement.classList.add(`column-width-${graphDate[0][i]}`);
        
        xlabelElement.classList.add(`column-width-${graphDate[0][i]}`);
        xlabelElement.classList.add('price-history_axe-x_label');
        xlabelElement.innerHTML = ((<templateFunc>xlabelT)({date: date}))
        xChert?.appendChild(chertElement);
        xlabel?.appendChild(xlabelElement);
    });
    // заполняем вертикаль
    const ylabel = graphContainer.querySelector('.price-history_axe-y_label-container');
    const formattedPrice = Math.max(...y) - Math.min(...y);
    const priceAxeY = [] as number[];
    priceAxeY.push(Math.min(...y));
    for (let i = 0; i < 3; i++) {
        if (formattedPrice == 0) {
            priceAxeY.push(Math.max(...y));
        } else {
            priceAxeY.push(formattedPrice * (i + 1) / 4);
        }
    }
    priceAxeY.push(Math.max(...y))
    
    priceAxeY.forEach(element => {
        const ylabelElement = document.createElement('div');
        ylabelElement.classList.add('price-history_axe-y_label');
        ylabelElement.innerHTML = ((<templateFunc>ylabelT)({price: element}))
        ylabel?.prepend(ylabelElement);
    })

    // сами графики
    graphDate[0].forEach((elem, i) => {
        const graphElement = document.createElement('div');
        graphElement.classList.add('price-history_plot_column');
        graphElement.classList.add(`column-width-${graphDate[0][i]}`);
        graphElement.classList.add(`column-height-${graphDate[1][i]}`);
        plot?.appendChild(graphElement);
    })
    return graphContainer;
}


function minMaxNorm(array: number[]) {
    if (array.length > 1) {
        const min = Math.min(...array);
        const max = Math.max(...array);
        return array.map((value)=> {
            return (value - min) / (max - min);
        });
    } else {
        return [1];
    }
}

function setAndConvertData (x:number[], y:number[]) {
    let sourceX = minMaxNorm(x);
    let sourceY = minMaxNorm(y);


    sourceX = sourceX.map((value) => {
        return Math.round(value * 100);
    });

    for (let i = 1; i < sourceX.length; i++) {
        sourceX[i - 1] = sourceX[i] - sourceX[i - 1];
    }

    sourceY = sourceY.map((value) => {
        return Math.round(value * 80 + 1);
    });

    console.log(sourceX, sourceY);
    return [sourceX.slice(0, sourceX.length - 1), sourceY];
}

function convertDateToNum(x: string[]) {
    const res = [] as number[];
    x.forEach(element => {
        res.push(new Date(element).getTime() / 1000 | 0);
    });
    res.push(Date.now() / 1000 | 0);
    return res;
}


function shortenDate(x: string[], y: number[]) {
    for (let i = 1; i < x.length; i++) {
        if (x[i - 1].slice(0, 10) == x[i].slice(0, 10)) {
            x.splice(i - 1, 1);
            y.splice(i - 1, 1);
            i--;
        }
    }
}