var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)        
    })
}

(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <link href="https://unpkg.com/frappe-datatable@0.0.5/dist/frappe-datatable.min.css" rel="stylesheet">
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
        await getScriptPromisify('https://unpkg.com/sortablejs@1.7.0/Sortable.min.js')
        await getScriptPromisify('https://unpkg.com/clusterize.js@0.18.0/clusterize.min.js')
        await getScriptPromisify('https://unpkg.com/frappe-datatable@0.0.5/dist/frappe-datatable.min.js')


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
        resultSet.forEach(dp => {
            const { rawValue, description } = dp[MEASURE_DIMENSION]
            const date = dp.Date.description

            if (dates.indexOf(date) === -1) {
                dates.push(date);
                dataSet.push(date);
            }

            if (description === 'Volume') {
                values.push(rawValue);
                dataSet.push(rawValue);
            }

        })

        const data = {
            dates,
            values
        }

        console.log(data);
        console.log(dataSet);

        if (this._example) {
            var datatable = new DataTable(this_example, {
                columns: ['Year', 'Volume'],
                data: [
                  ['2021', '1200'],
                  ['2022', '1400'],
                ]
              });
        }        

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