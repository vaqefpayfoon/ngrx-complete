import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';

// Models
import { IDashboard } from '../../models';

@Component({
  selector: 'neural-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardChartComponent implements OnInit {
  @Input() chart: IDashboard.IChart;

  get colorway() {
    return [
      'rgb(33, 75, 99)',
      'rgb(205, 152, 36)',
      'rgb(175,175,175)',
      'rgb(175, 49, 35)',
      'rgb(151, 179, 100)',
      'rgb(36, 73, 147)',
    ];
  }

  // options
  graph: any = {
    data: [],
    layout: {
      colorway: this.colorway,
      autosize: true,
      useResizeHandler: true,
      xaxis: {
        visible: true,
        type: 'date',
        tickmode: 'linear',
        dtick: 'D1',
        tickangel: 45,
        tickformat: '%d %b',
      },
      yaxis: {
        visible: true,
      },
    },
  };

  config = { responsive: true, displaylogo: false, };

  constructor() {}

  initData() {
    if (
      IDashboard.IndicatorTypes[this.chart.chartType] ===
      IDashboard.IndicatorTypes.LINE
    ) {
      this._lineChart();
    }
    if (
      IDashboard.IndicatorTypes[this.chart.chartType] ===
      IDashboard.IndicatorTypes.INDICATOR
    ) {
      this._indicator();
    }
    if (
      IDashboard.IndicatorTypes[this.chart.chartType] ===
      IDashboard.IndicatorTypes.PIE
    ) {
      this._pie();
    }
    if (
      IDashboard.IndicatorTypes[this.chart.chartType] ===
      IDashboard.IndicatorTypes.BAR
    ) {
      this._bar();
    }
    if (
      IDashboard.IndicatorTypes[this.chart.chartType] ===
      IDashboard.IndicatorTypes.TREEMAP
    ) {
      this._treemap();
    }
  }

  private _lineChart() {
    const dataFunction = async (
      x: any[],
      y: any[],
      index: number,
      name?: string
    ) => {
      const data: any = {
        x,
        y,
        name,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
          color: !!this.colorway[index] ? this.colorway[index] : '#4265ed',
        },
        line: {
          shape: 'spline',
          color: this.colorway[index] ? this.colorway[index] : '#4265ed',
        },
        connectgaps: true,
      };

      if (!x.length) {
        this.graph.layout.xaxis.visible = false;
        this.graph.layout.yaxis.visible = false;

        this.graph.layout = {
          ...this.graph.layout,
          annotations: [
            {
              text: 'No data found',
              xref: 'paper',
              yref: 'paper',
              showarrow: false,
              font: {
                size: 28,
              },
            },
          ],
        };
      }

      this.graph.data[index] = data;
    };

    this.chart.items.forEach(async (ele: any, index: number) => {
      const x = [];
      const y = [];

      if (Array.isArray(ele.value)) {
        ele.value.forEach((el: any) => {
          x.push(el.key);
          y.push(el.value);
        });
      }

      await dataFunction(x, y, index, ele.key);
    });

    if (!this.chart.items.length) {
      return dataFunction([], [], 0);
    }
  }

  private _indicator() {
    const dataFunction = async (value: number, text: string, index: number) => {
      const data: any = {
        value,
        title: { text },
        type: 'indicator',
        mode: 'number',
      };

      this.graph.data[index] = data;
    };

    this.chart.items.forEach(async (ele: any, index: number) => {
      await dataFunction(ele.value, ele.key, index);
    });

    this.graph.layout = {
      colorway: this.colorway,
      autosize: true,
      useResizeHandler: true,
    };
  }

  private _pie() {
    if (!this.chart.items.length) {
      this.graph.layout = {
        xaxis: {
          visible: false,
        },
        yaxis: {
          visible: false,
        },
        annotations: [
          {
            text: 'No data found',
            xref: 'paper',
            yref: 'paper',
            showarrow: false,
            font: {
              size: 28,
            },
          },
        ],
      };
    } else {
      const dataFunction = (values: any[], labels: any[]) => {
        const data: any = {
          values,
          labels,
          type: 'pie',
          textinfo: 'label+percent',
          textposition: 'outside',
        };

        this.graph.data[0] = data;
      };

      const x = [];
      const y = [];

      this.chart.items.forEach((ele: any) => {
        x.push(ele.value);
        y.push(ele.key);
      });

      dataFunction(x, y);

      this.graph.layout = {
        autosize: true,
        useResizeHandler: true,
        margin: { t: 0, b: 0, l: 60, r: 60 },
        showlegend: false,
        colorway: this.colorway,
      };
    }
  }

  private _treemap() {
    if (!this.chart.items.length) {
      this.graph.layout = {
        xaxis: {
          visible: false,
        },
        yaxis: {
          visible: false,
        },
        annotations: [
          {
            text: 'No data found',
            xref: 'paper',
            yref: 'paper',
            showarrow: false,
            font: {
              size: 28,
            },
          },
        ],
      };
    } else {
      const dataFunction = (labels: any[], parents: any[]) => {
        const data: any = {
          labels,
          parents,
          type: 'treemap',
        };

        this.graph.data[0] = data;
      };

      const x = [];
      const y = [];

      this.chart.items.forEach((ele: any) => {
        x.push(ele.value);
        y.push(ele.key);
      });

      dataFunction(x, y);

      this.graph.layout = {
        autosize: true,
        useResizeHandler: true,
        colorway: this.colorway,
      };
    }
  }

  private _bar() {
    if (!this.chart.items.length) {
      this.graph.layout = {
        xaxis: {
          visible: false,
        },
        yaxis: {
          visible: false,
        },
        annotations: [
          {
            text: 'No data found',
            xref: 'paper',
            yref: 'paper',
            showarrow: false,
            font: {
              size: 28,
            },
          },
        ],
      };
    } else {
      const dataFunction = (x: any[], y: any[], index: number) => {
        const [name] = x;

        const data: any = {
          x,
          y,
          name,
          type: 'bar',
        };

        this.graph.data[index] = data;

        this.graph.layout = {
          autosize: true,
          useResizeHandler: true,
          colorway: this.colorway,
        };
      };

      this.chart.items.forEach(async (ele: any, index: number) => {
        await dataFunction([ele.key], [ele.value], index);
      });
    }
  }

  get types() {
    return IDashboard.IndicatorTypes;
  }

  get totalRates() {
    if (
      IDashboard.IndicatorTypes[this.chart.chartType] ===
      IDashboard.IndicatorTypes.RATE
    ) {
      return this.chart.items.reduce((prev, cur) => prev + cur.value, 0);
    }
  }

  get total() {
    if (
      IDashboard.IndicatorTypes[this.chart.chartType] ===
      IDashboard.IndicatorTypes.RATE
    ) {
      return this.chart.items.reduce(
        (prev, cur) => prev + parseInt(cur.key, 10) * cur.value,
        0
      );
    }
  }

  get avg() {
    const sum = this.total / this.totalRates;

    if (isNaN(sum)) {
      return 0;
    }
    return Math.round(sum * 100) / 100;
  }

  getStarIcon(index: number) {
    if (index <= Math.floor(this.avg)) {
      return 'star';
    } else if (index === Math.ceil(this.avg)) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }

  ngOnInit() {
    this.initData();
  }
}
