var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)        
    })
}

(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" type="text/css">
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
        await getScriptPromisify('https://cdn.jsdelivr.net/npm/simple-datatables@latest')


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

        let myData = {
            "headings": [
                "Name",
                "Company",
                "Ext.",
                "Start Date",
                "Email",
                "Phone No."
            ],
            "data": [
                [
                    "Hedwig F. Nguyen",
                    "Arcu Vel Foundation",
                    "9875",
                    "03/27/2017",
                    "nunc.ullamcorper@metusvitae.com",
                    "070 8206 9605"
                ],
                [
                    "Genevieve U. Watts",
                    "Eget Incorporated",
                    "9557",
                    "07/18/2017",
                    "Nullam.vitae@egestas.edu",
                    "0800 106980"
                ]
            ]
        };
        

        var dataTable = new DataTable('#example', {
            searchable: false,
            fixedHeight: true,
            data: myData
            
        });    

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