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
                { field: "dates", rowGroup: true },
                { field: "measure" }
            ];



            const gridOptions = {
                defaultColDef: {
                    // set filtering on for all columns
                    filter: true,
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                },
                enableRangeSelection: true,
                allowContextMenuWithControlKey: true,
                getContextMenuItems: getContextMenuItems,
                columnDefs: columnDefs,
                rowData: dataSet
            };

            const eGridDiv = this._root.querySelector('#example');

            // create the grid passing in the div to use together with the columns & data we want to use
            new agGrid.Grid(eGridDiv, gridOptions);

        }

        getContextMenuItems(params) {
            var result = [
              {
                // custom item
                name: 'Alert ' + params.value,
                action: function () {
                  window.alert('Alerting about ' + params.value);
                },
                cssClasses: ['redFont', 'bold'],
              },
              {
                // custom item
                name: 'Always Disabled',
                disabled: true,
                tooltip:
                  'Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!',
              },              
              'copy',
              'separator',
              'chartRange',
              'export',
            ];
          
            return result;
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