var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <link href="https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css" rel="stylesheet" />
    <style>
    #root {
      background-color: #fff;
    }
    #placeholder {
      padding-top: 1em;
      text-align: center;
      font-size: 1.5em;
      color: white;
    }
    </style>
    <div id="root" style="width: 100%; height: 100%;">
        <div id="placeholder">Grid Layout</div>
        <div id="example"></div>
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
            await getScriptPromisify('https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.umd.js')


            this._placeholder = this._root.querySelector('#placeholder')
            if (this._placeholder) {
                this._root.removeChild(this._placeholder)
                this._placeholder = null
            }

            const MEASURE_DIMENSION = 'Account'
            const dates = []
            const values = []
            const dataSet = []
            const columns = [
                {
                    id: "dates",
                    name: "Date"
                }, 
                {
                    id: 'measure',
                    name: 'Volume'
                }
            ]
            console.log(resultSet);
            var tmpData
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

            new gridjs.Grid({
                columns: columns,
                data: dataSet,
                search: {
                    enabled: true
                },
                pagination: {
                    limit: 1
                },
                sort: true
            }).render(this._root.querySelector('#example'));

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