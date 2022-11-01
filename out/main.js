// import $ from 'jquery'  
class InsertEditor {
    constructor(settings) {
        this.frame = document.querySelector(`[data-editor-frame]`);
        this.form_name = null;
        this.settings = {};
        this.button_selectors = {
            bold: "data-btn-bold",
            italic: "data-btn-italic",
            underline: "data-btn-underline",
            paragraph: "data-btn-paragraph",
        };
        this.action_tags = {
            bold: 'b',
            italic: 'i',
            underline: 'u',
            paragraph: 'p',
        };
        this.action_status = {
            bold: false,
            italic: false,
            underline: false,
            paragraph: false,
        };
        this.editor = document.querySelector(`[data-editor-block]`);
        this.action_buttons = {
            bold: document.querySelector(`[${this.button_selectors.bold}]`),
            italic: document.querySelector(`[${this.button_selectors.italic}]`),
            underline: document.querySelector(`[${this.button_selectors.underline}]`),
            paragraph: document.querySelector(`[${this.button_selectors.paragraph}]`),
        };
        if (settings.editor_class)
            this.frame = document.querySelector(`.${settings.editor_class}`);
        if (settings.form_name)
            this.form_name = settings.form_name;
        if (!this.frame)
            throw new Error('No Editor Found');
        this.settings = Object.assign(Object.assign({}, this.settings), settings);
    }
    printEditorHTML() {
        let html = !this.frame ? null : this.frame.innerHTML =
            `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <style>
                .Insert-props .insert-control-panel button{
                    position:relative;
                }
                .Insert-props .insert-control-panel button:hover::after{
                    content:attr(data-info)" ";
                    position:absolute;
                    background:#555;
                    display:inline-block;
                    color:#eee;
                    padding:2px;
                    font-size:0.6rem;
                    z-index:1000;
                    width:clamp(20px, 35px, 100px);
                    text-overflow:word-break;
                    overflow-wrap:anywhere;

                    
                }
            </style>
            <div class="Insert-props" >
            <div class="insert-control-panel">
            <!-- Some action button -->
            <button type="button" title="bold" class="fa fa-bold" aria-hidden="true" ${this.button_selectors.bold} data-info="bold"></button>
            <button type="button" title="italic" class="fa fa-italic" aria-hidden="true" ${this.button_selectors.italic} data-info="italic"></button>
            <button type="button" title="underline" class="fa fa-underline" aria-hidden="true" ${this.button_selectors.underline} data-info="underline"></button>
            <button type="button" title="new paragraph" class="fa fa-paragraph" aria-hidden="true" ${this.button_selectors.paragraph} data-info="paragraph"></button>
            <button type="button" title="align left" class="fa fa-align-left" aria-hidden="true" data-btn-align="left" data-info="text-align:left"></button>
            <button type="button" class="fa fa-align-right" aria-hidden="true" data-btn-align="right" data-info="text-align:right"></button>
            <button type="button" class="fa fa-align-center" aria-hidden="true" data-btn-align="center" data-info="text-align:center"></button>
            <button type="button" class="fa fa-list-ul" aria-hidden="true" data-btn-list="ul"  data-info="list:unordered"></button>
            <button type="button" class="fa fa-list-ol" aria-hidden="true" data-btn-list="ol" data-info="list:ordered"></button>
            <button type="button" class="fa fa-table" aria-hidden="true" data-btn-table data-info="table"></button>
            <input type="color" data-btn-color value="#000000" />
            </div>
            <!-- The editor -->
            <style>
                
            </style>
            <div contenteditable="true" id="deditorBox1245" data-editor-block oncontextmenu="return false" style="background:#8d8;width:200px;aspect-ratio: 1;">
                
            </div>
            <!-- this is the input tag required for your form upload. it carries the data in the editor -->
            <input type="text" value="" style="visibility:hidden" name="${this.form_name || ''}" />
            </div>
        `;
        return this.assignActionButton()
            .addEventListners()
            .setCaret();
    }
    assignActionButton() {
        this.editor = document.querySelector(`[data-editor-block]`);
        this.action_buttons = {
            bold: document.querySelector(`[${this.button_selectors.bold}]`),
            italic: document.querySelector(`[${this.button_selectors.italic}]`),
            underline: document.querySelector(`[${this.button_selectors.underline}]`),
            paragraph: document.querySelector(`[${this.button_selectors.paragraph}]`),
        };
        return this;
    }
    addEventListners() {
        return this.setBoldListners()
            .setItalicListners()
            .setUnderlineListners()
            .setParagraphListners();
    }
    setCaret(selector) {
        var _a, _b;
        try {
            let startNode = selector == null ? this.editor : (_a = this.editor) === null || _a === void 0 ? void 0 : _a.querySelector(selector.toLowerCase());
            startNode = !startNode ? (_b = this.editor) === null || _b === void 0 ? void 0 : _b.lastChild : startNode;
            // console.log(startNode, document.querySelector(selector), selector)
            let range = document.createRange(), sel = window.getSelection();
            if (!startNode)
                throw new Error('Start Node Error');
            range.setStart(startNode, 0);
            range.setEnd(startNode, 1);
            range.collapse(false);
            sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
            sel === null || sel === void 0 ? void 0 : sel.addRange(range);
        }
        catch (e) {
            console.error(e === null || e === void 0 ? void 0 : e.getMessage());
            console.error(e);
        }
        finally {
            return this;
        }
    }
    getCurrentNode() {
        var _a, _b, _c, _d;
        let currentNodeActive = (_c = (_b = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.anchorNode) === null || _b === void 0 ? void 0 : _b.parentElement) !== null && _c !== void 0 ? _c : this.editor;
        if (!((_d = this.editor) === null || _d === void 0 ? void 0 : _d.contains(currentNodeActive)))
            currentNodeActive = this.editor;
        return currentNodeActive;
    }
    setBoldListners() {
        var _a;
        (_a = this.action_buttons.bold) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            console.log("I am bold");
            this.handleNodeCreation('bold');
        });
        return this;
    }
    setItalicListners() {
        var _a;
        (_a = this.action_buttons.italic) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            console.log("I am Italic");
            this.handleNodeCreation('italic');
        });
        return this;
    }
    setUnderlineListners() {
        var _a;
        (_a = this.action_buttons.underline) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            console.log("I am Underline");
            this.handleNodeCreation('underline');
        });
        return this;
    }
    setParagraphListners() {
        var _a;
        (_a = this.action_buttons.paragraph) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            console.log("I am paragraph");
            this.handleNodeCreation('paragraph');
        });
        return this;
    }
    handleNodeCreation(NodeType) {
        var _a, _b, _c, _d;
        let TAG = this.getNodeTag(NodeType).toLowerCase();
        let parent = this.getCurrentNode();
        let highlighted = false;
        if (((_a = window === null || window === void 0 ? void 0 : window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString().trim()) !== "" || ((_d = (_c = (_b = window === null || window === void 0 ? void 0 : window.getSelection()) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.length))
            highlighted = true;
        if (highlighted) {
            return this.handleHighlighted(NodeType);
        }
        if (this.action_status[`${NodeType}`])
            TAG = "div".toLowerCase();
        const newElement = document.createElement(TAG), id = `${TAG}${new Date().valueOf()}`.toLowerCase();
        newElement.setAttribute("id", id);
        if (this.action_status[`${NodeType}`]) {
            let count = 0;
            while ((parent === null || parent === void 0 ? void 0 : parent.tagName.toLowerCase()) != TAG.toLowerCase() && count < 15) {
                console.log('trying to find parent element');
                parent = !(parent === null || parent === void 0 ? void 0 : parent.parentNode) ? parent : parent === null || parent === void 0 ? void 0 : parent.parentElement;
                count++;
            }
            if ((parent === null || parent === void 0 ? void 0 : parent.tagName.toLowerCase()) != TAG.toLowerCase() && count > 15)
                parent = this.editor;
        }
        parent === null || parent === void 0 ? void 0 : parent.appendChild(newElement);
        newElement.innerHTML = "&nbsp;";
        console.log(newElement);
        this.action_status[`${NodeType}`] = !this.action_status[`${NodeType}`];
        return this.setCaret(`#${id}`);
    }
    handleHighlighted(NodeType) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        let TAG = this.getNodeTag(NodeType).toLowerCase();
        let parentNode = (_b = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.anchorNode) === null || _b === void 0 ? void 0 : _b.parentNode;
        let highlightedNode = (_c = window.getSelection()) === null || _c === void 0 ? void 0 : _c.anchorNode;
        const range = (_e = (_d = window.getSelection()) === null || _d === void 0 ? void 0 : _d.getRangeAt(0)) !== null && _e !== void 0 ? _e : (_f = document.getSelection()) === null || _f === void 0 ? void 0 : _f.getRangeAt(0);
        if (((_h = (_g = highlightedNode === null || highlightedNode === void 0 ? void 0 : highlightedNode.parentNode) === null || _g === void 0 ? void 0 : _g.nodeName) === null || _h === void 0 ? void 0 : _h.toLowerCase()) == TAG)
            TAG = "span";
        let _text = (_k = (_j = window.getSelection()) === null || _j === void 0 ? void 0 : _j.toString()) !== null && _k !== void 0 ? _k : '', id = `${TAG}${new Date().valueOf()}`.toLowerCase();
        const newElement = document.createElement(TAG);
        newElement.setAttribute('id', `${id}`);
        (_l = window.getSelection()) === null || _l === void 0 ? void 0 : _l.deleteFromDocument();
        console.log((_m = highlightedNode === null || highlightedNode === void 0 ? void 0 : highlightedNode.parentNode) === null || _m === void 0 ? void 0 : _m.nodeName, TAG);
        if (((_p = (_o = highlightedNode === null || highlightedNode === void 0 ? void 0 : highlightedNode.parentNode) === null || _o === void 0 ? void 0 : _o.nodeName) === null || _p === void 0 ? void 0 : _p.toLowerCase()) == this.getNodeTag(NodeType).toLowerCase()) {
            // if(highlightedNode?.nodeName?.toLowerCase() == "#text"){ parentNode?.appendChild(newElement)}
            (_q = parentNode === null || parentNode === void 0 ? void 0 : parentNode.parentNode) === null || _q === void 0 ? void 0 : _q.appendChild(newElement);
        }
        else {
            // highlightedNode?.replaceWith(newElement)
            if (range != null) {
                // var newNode = $(`<${TAG}>  </${TAG}>`)[0];
                range.surroundContents(newElement);
            }
        }
        newElement.innerHTML = _text;
        this.setCaret(`#${id}`);
    }
    getNodeTag(NodeType) {
        return this.action_tags[`${NodeType}`];
    }
}
export { InsertEditor };
