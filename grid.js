var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    let template = document.createElement("template");
    template.innerHTML = `
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
            await getScriptPromisify('https://unpkg.com/cheetah-grid@1.1')


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

            const grid = new cheetahGrid.ListGrid({
                // Parent element on which to place the grid
                parentElement: this._root.querySelector('#example'),
                header: [
                    { field: 'personid', caption: 'ID', width: '100%' },
                    { field: 'fname', caption: 'First Name', width: '100%' },
                    { field: 'lname', caption: 'Last Name', width: '100%' },
                    { field: 'email', caption: 'Email', width: '100%' },
                ],
            });
            grid.records = [
                {'personid': 1, 'fname': 'Sophia', 'lname': 'Hill', 'email': 'sophia_hill@example.com'},
                {'personid': 2, 'fname': 'Aubrey', 'lname': 'Martin', 'email': 'aubrey_martin@example.com'},
                {'personid': 3, 'fname': 'Avery', 'lname': 'Jones', 'email': 'avery_jones@example.com'},
                {'personid': 4, 'fname': 'Joseph', 'lname': 'Rodriguez', 'email': 'joseph_rodriguez@example.com'},
                {'personid': 5, 'fname': 'Samuel', 'lname': 'Campbell', 'email': 'samuel_campbell@example.com'},
                {'personid': 6, 'fname': 'Joshua', 'lname': 'Ortiz', 'email': 'joshua_ortiz@example.com'},
                {'personid': 7, 'fname': 'Mia', 'lname': 'Foster', 'email': 'mia_foster@example.com'},
                {'personid': 8, 'fname': 'Landon', 'lname': 'Lopez', 'email': 'landon_lopez@example.com'},
                {'personid': 9, 'fname': 'Audrey', 'lname': 'Cox', 'email': 'audrey_cox@example.com'},
                {'personid': 10, 'fname': 'Anna', 'lname': 'Ramirez', 'email': 'anna_ramirez@example.com'}
              ];

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