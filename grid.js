var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <link rel="stylesheet" href="/node_modules/ag-grid-community/dist/styles/webfont/agGridClassicFont.css"/>
    <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-grid.css">
    <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-theme-alpine.css">    
    <div id="root" style="width: 100%; height: 100%;">
        <div id="placeholder">Grid Layout</div>
        <button class="btnClick">Print</button>
        <div id="example" style="height: 100%; width:100%;" class="ag-theme-alpine"></div>
    </div>
 `;

    class GridWidget extends HTMLElement {
        constructor() {
            super();
            this._btnClick = this._root.querySelector('.btnClick')
            this._btnClick.addEventListener('click', function() {
                onBtPrint();
            });
            let clickEvent = new Event('click');
            this._btnClick.dispatchEvent(clickEvent);

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(template.content.cloneNode(true))

            this._root = this._shadowRoot.getElementById('root')            

            this._props = {}
        }

        async render(resultSet) {
            
            await getScriptPromisify('https://unpkg.com/ag-grid-enterprise/dist/ag-grid-enterprise.min.noStyle.js')
           // await getScriptPromisify('https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.noStyle.js')


            this._placeholder = this._root.querySelector('#placeholder')
            if (this._placeholder) {
                this._root.removeChild(this._placeholder)
                this._placeholder = null
            }

            //this._example = this._root.querySelector('#example')

            const MEASURE_DIMENSION = 'Account'
            const dates = []
            const values = []
            const dataSet = []
            console.log(resultSet);
            var tmpData = {}
            resultSet.forEach(dp => {
                const { rawValue, description } = dp[MEASURE_DIMENSION]
                const date = dp.Date.description

                tmpData = {
                    "dates": date,
                    "measure": rawValue
                }

                dataSet.push(tmpData);

                if (dates.indexOf(date) === -1) {
                    dates.push(date);

                }
                if (description === 'Volume') {
                    values.push(rawValue);
                }

            })

            const data = {
                dates,
                values
            }

            console.log(data);
            console.log(dataSet);

            const columnDefs = [
                {
                    field: 'dates',
                    type: 'dateColumn',
                    filter: 'agDateColumnFilter',
                    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
                },
                {
                    field: 'measure',
                    aggFunc: 'sum',
                }
            ];



            const gridOptions = {
                sideBar: {
                    toolPanels: [
                      {
                        id: 'columns',
                        labelDefault: 'Columns',
                        labelKey: 'columns',
                        iconKey: 'columns',
                        toolPanel: 'agColumnsToolPanel',
                      },
                      {
                        id: 'filters',
                        labelDefault: 'Filters',
                        labelKey: 'filters',
                        iconKey: 'filter',
                        toolPanel: 'agFiltersToolPanel',
                      },
                    ],
                    defaultToolPanel: 'filters',
                  },
                statusBar: {
                    statusPanels: [
                        {
                            statusPanel: 'agAggregationComponent',
                            statusPanelParams: {
                                // possible values are: 'count', 'sum', 'min', 'max', 'avg'
                                aggFuncs: ['avg', 'sum']
                            }
                        }
                    ]
                },
                defaultColDef: {
                    // set filtering on for all columns
                    filter: true,
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                    editable: true,
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    sortable: true,
                },
                pagination: true,
                paginationPageSize: 10,
                //rowSelection: 'multiple',
                //rowGroupPanelShow: 'always',
                pivotPanelShow: 'always',
                //enableRangeSelection: true,
                allowContextMenuWithControlKey: true,
                /*
                getContextMenuItems: [
                    'copy',
                    'separator',
                    'chartRange',
                    'export',
                ],
                enableCharts: true,
                getChartToolbarItems: [
                    'chartDownload',
                    'chartData',
                    'chartSettings',
                ],
                */
                columnDefs: columnDefs,
                rowData: dataSet
            };

            const eGridDiv = this._root.querySelector('#example');

            // create the grid passing in the div to use together with the columns & data we want to use
            new agGrid.Grid(eGridDiv, gridOptions);

        }

        onCustomWidgetResize(width, height) {
            this.render()
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }
        onCustomWidgetAfterUpdate(changedProperties) {

        }
    }
    customElements.define("com-grid-main", GridWidget);

    function onBtPrint() {
        const api = gridOptions.api;
    
        setPrinterFriendly(api);
    
        /*
        setTimeout(function () {
            print();
            setNormal(api);
        }, 2000);
        */
    }
    
    function setPrinterFriendly(api) {
        const eGridDiv = document.querySelector('#myGrid');
        eGridDiv.style.height = '';
        api.setDomLayout('print');
    }

})();

