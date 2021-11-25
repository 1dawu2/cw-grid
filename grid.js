var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-grid.css">
    <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-theme-alpine.css">
    <div id="root" style="width: 100%; height: 100%;">
        <div id="placeholder">Grid Layout</div>
        <button onclick="onBtExport()" style="margin-bottom: 5px; font-weight: bold;">Export to Excel</button>
        <div id="example" style="height: 100%; width:100%;" class="ag-theme-alpine"></div>
    </div>
 `;

    class GridWidget extends HTMLElement {
        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(template.content.cloneNode(true))

            this._root = this._shadowRoot.getElementById('root')
            this._example = this._root.querySelector('#example')

            this._props = {}
        }

        onBtExport() {
            gridOptions.api.exportDataAsExcel();
        }

        async render(resultSet) {
            await getScriptPromisify('https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.noStyle.js')


            this._placeholder = this._root.querySelector('#placeholder')
            if (this._placeholder) {
                this._root.removeChild(this._placeholder)
                this._placeholder = null
            }

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
                    "dates" : date,
                    "measure" : rawValue
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
            console.log(columns);

            const columnDefs = [
                { field: "dates" , rowGroup: true},
                { field: "measure" }
              ];
          


              const gridOptions = {
                defaultColDef: {
                    // set filtering on for all columns
                    filter: true,
                },
                columnDefs: columnDefs,
                rowData: dataSet
              };              

              const eGridDiv = this._root.querySelector('#example');

              // create the grid passing in the div to use together with the columns & data we want to use
              new agGrid.Grid(eGridDiv, gridOptions);

            /*
            new gridjs.Grid({
                columns: columns,
                data: dataSet,
                search: {
                    enabled: true
                },
                pagination: {
                    limit: 2
                },
                sort: true
            }).render(this._root.querySelector('#example'));
            */

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
})();