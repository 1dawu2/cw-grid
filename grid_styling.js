(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Grid Widget Settings</legend>
        </fieldset>
    </form>
    `;
    class GridWidgetStylingPanel extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            this._shadowRoot.getElementById("form").addEventListener("submit",
                this._submit.bind(this));
        }
        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {

                    }
                }
            }));
        }
    }
    customElements.define("com-grid-styling",GridWidgetStylingPanel);
})();