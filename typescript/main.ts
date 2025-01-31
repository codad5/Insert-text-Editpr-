import type { EditorSettings, action_buttons, element_tagName } from "./components/types.js";
// import $ from 'jquery'  
class InsertEditor{
    private frame : Element|null = document.querySelector(`[data-editor-frame]`);
    readonly form_name : String|null = null;
    readonly settings : EditorSettings = {
        
    }
    readonly button_selectors: action_buttons<String> = {
        bold: "data-btn-bold",
        italic: "data-btn-italic",
        underline: "data-btn-underline",
        paragraph: "data-btn-paragraph",
        destroy: "data-btn-destroy",
        refresh: 'data-btn-refresh'
    }
    readonly action_tags: action_buttons<String> = {
        bold: 'b',
        italic: 'i',
        underline: 'u',
        paragraph: 'p',
        destroy: '',
        refresh: ''
    }
    readonly action_status: action_buttons<Boolean> = {
        bold: false,
        italic: false,
        underline: false,
        paragraph: false,
        destroy: false,
        refresh: false
    }
    editor : Element|null = document.querySelector(`[data-editor-block]`);
    input : Element|null = document.querySelector(`[data-editor-input]`);
    action_has_on_off : String[] = ['bold', 'italic', 'underline'].map(v => v.toLowerCase())
    action_buttons : action_buttons<Element|null>  = {
        bold: document.querySelector(`[${this.button_selectors.bold}]`),
        italic: document.querySelector(`[${this.button_selectors.italic}]`),
        underline: document.querySelector(`[${this.button_selectors.underline}]`),
        paragraph: document.querySelector(`[${this.button_selectors.paragraph}]`),
        destroy: document.querySelector(`[${this.button_selectors.destroy}]`),
        refresh: document.querySelector(`[${this.button_selectors.refresh}]`)
    }
    
    constructor(settings : EditorSettings){
        if(settings.editor_class) this.frame= document.querySelector(`.${settings.editor_class}`)
        if(settings.form_name) this.form_name = settings.form_name
        if(!this.frame) throw new Error('No Editor Found')
        this.settings = {...this.settings, ...settings}
        
    }

    refresh(){
        return this.printEditorHTML();
    }

    delete(){
        const clone = this.frame
        this.frame?.remove()
        this.frame = clone;
        return this
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
            <button type="button" title="new paragraph" class="fa fa-refresh" aria-hidden="true" ${this.button_selectors.refresh} data-info="Refresh Editor"></button>
            <button type="button" title="align left" class="fa fa-align-left" aria-hidden="true" data-btn-align="left" data-info="text-align:left"></button>
            <button type="button" class="fa fa-align-right" aria-hidden="true" data-btn-align="right" data-info="text-align:right"></button>
            <button type="button" class="fa fa-align-center" aria-hidden="true" data-btn-align="center" data-info="text-align:center"></button>
            <button type="button" class="fa fa-list-ul" aria-hidden="true" data-btn-list="ul"  data-info="list:unordered"></button>
            <button type="button" class="fa fa-list-ol" aria-hidden="true" data-btn-list="ol" data-info="list:ordered"></button>
            <button type="button" class="fa fa-table" aria-hidden="true" data-btn-table data-info="table"></button>
            <input type="color" data-btn-color value="#000000"/>
            </div>
            <!-- The editor -->
            <style>
                
            </style>
            <div contenteditable="true" id="deditorBox1245" data-editor-block oncontextmenu="return false" style="background:#8d8;width:200px;aspect-ratio: 1;">
                
            </div>
            <!-- this is the input tag required for your form upload. it carries the data in the editor -->
            <input type="text" value="" style="visibility:hidden" name="${this.form_name || ''}" data-editor-input />
            </div>
        ` ;
        return this.assignActionButton()
        .addEventListners()
        .setCaret()
    }

    assignActionButton(){
        this.editor = document.querySelector(`[data-editor-block]`);
        this.input = document.querySelector(`[data-editor-input]`);
        this.action_buttons   = {...this.action_buttons,
        bold: document.querySelector(`[${this.button_selectors.bold}]`),
        italic: document.querySelector(`[${this.button_selectors.italic}]`),
        underline: document.querySelector(`[${this.button_selectors.underline}]`),
        paragraph: document.querySelector(`[${this.button_selectors.paragraph}]`),
        destroy:document.querySelector(`[${this.button_selectors.destroy}]`),
        refresh:document.querySelector(`[${this.button_selectors.refresh}]`)
        }
        return this;
    }
    setDeleteButton(Element_: string){
        this.action_buttons   = {...this.action_buttons, destroy:document.querySelector(Element_) }
        return this.setDestroyListners()
    }
    
    addEventListners(){
        return this.setBoldListner()
        .setItalicListner()
        .setUnderlineListners()
        .setParagraphListners()
        .setDestroyListners()
        .setRefreshListners()
        .saveToInputListner()
    }

    private setCaret(selector ?: String){
        try{

            let startNode : Element|null|undefined|ChildNode  = selector == null ? this.editor : this.editor?.querySelector(selector.toLowerCase())
            startNode = !startNode  ? this.editor?.lastChild : startNode
            // console.log(startNode, document.querySelector(selector), selector)
            let range = document.createRange(),
            sel = window.getSelection() 
            if(!startNode) throw new Error('Start Node Error')
            range.setStart(startNode, 0)
            range.setEnd(startNode, 1)
            range.collapse(false)
            sel?.removeAllRanges()
            sel?.addRange(range)
        }
        catch(e: Error|any){
            console.error(e?.getMessage())
            console.error(e)
        }
        finally{
            return this
        }
    }

    private getCurrentSelectedNode(): Node|Element|null{
        let currentNodeActive : Node|Element|null = window.getSelection()?.anchorNode ?? this.editor
        if (!this.editor?.contains(currentNodeActive)) currentNodeActive = this.editor
        return currentNodeActive
    }

    private setBoldListner() {
        this.action_buttons.bold?.addEventListener('click', () => {
            console.log("I am bold")
            this.handleNodeCreation('bold')
        })
        return this
    }
    private saveToInputListner() {
        this.editor?.addEventListener('input', () => {
            return this.updateInput()
        })
        return this
    }
    private setDestroyListners() {
        this.action_buttons.destroy?.addEventListener('click', () => {
            console.log("Destroyed! thanks for using Insert Editor")
            this.delete()
        })
        return this
    }
    private setRefreshListners() {
        this.action_buttons.refresh?.addEventListener('click', () => {
            console.log("Refresh Start")
            console.time("Refresh Ended")
            this.refresh()
            console.timeEnd("Refresh Ended")
        })
        return this
    }

    private setItalicListner() {
        this.action_buttons.italic?.addEventListener('click', () => {
            console.log("I am Italic")
            this.handleNodeCreation('italic')

        })
        return this
    }

    private setUnderlineListners() {
        this.action_buttons.underline?.addEventListener('click', () => {
            console.log("I am Underline")
            this.handleNodeCreation('underline')
        })
        return this
    }

    private setParagraphListners() {
        this.action_buttons.paragraph?.addEventListener('click', () => {
            console.log("I am paragraph")
            this.handleNodeCreation('paragraph')
        })
        return this
    }
    private handleNodeCreation(NodeType : element_tagName){
        let TAG = this.getNodeTag(NodeType).toLowerCase()
        let parent: Element|null = this.getCurrentSelectedNode()?.parentElement ?? this.editor
        parent = this.editor?.parentElement == parent ? this.editor : parent
        let highlighted = false
        if (window?.getSelection()?.toString().trim() !== "" || window?.getSelection()?.toString()?.trim()?.length) highlighted = true
        if(highlighted){
            return this.handleHighlighted(NodeType)
        }
        if(this.action_status[`${NodeType}`]) TAG = "span".toLowerCase()
        const newElement : Element = document.createElement(TAG),
        id =  `${TAG}${new Date().valueOf()}`.toLowerCase()
        newElement.setAttribute("id", id)
        if(this.action_status[`${NodeType}`]){
            parent = this.getParentOfDiffrentType(parent, NodeType)
        }
        const range = window.getSelection()?.getRangeAt(0), 
        range_element = this.getParentOfDiffrentType(range?.commonAncestorContainer ?? null, NodeType)
        this.action_status[`${NodeType}`] ? range?.surroundContents(newElement) : range_element?.appendChild(newElement)
        // range && range?.commonAncestorContainer?.parentElement == this.editor ? range?.surroundContents(newElement) : parent?.appendChild(newElement)
        // console.log(this.getParentOfDiffrentType(range.commonAncestorContainer.parentElement, NodeType))
        console.log(range_element, range?.commonAncestorContainer, range, range_element != this.editor )
        newElement.innerHTML = "&nbsp;";
        this.action_status[`${NodeType}`] = !this.action_status[`${NodeType}`]
        return this.updateInput().turnButton(NodeType).setCaret(`#${id}`)
        
        
    }

    getParentOfDiffrentType(parent: Element|null, NodeType: element_tagName){
        let count = 0, to_be_returned : Element|null = parent ?? this.editor
        console.log('NodeName => '+ to_be_returned?.nodeName.toLowerCase(), to_be_returned)
        if('#text' == to_be_returned?.nodeName.toLowerCase()) to_be_returned = to_be_returned?.parentElement
        console.log('NodeName => '+ to_be_returned?.nodeName.toLowerCase())
        while(to_be_returned?.nodeName.toLowerCase() == this.getNodeTag(NodeType).toLowerCase() && count < 15 && this.editor != to_be_returned){
                // console.log(`${parent?.nodeName.toLowerCase()} === ${this.getNodeTag(NodeType).toLowerCase()}`)
                // console.log('trying to find parent element => ', parent?.nodeName.toLowerCase())
                // console.log(`Are they same ? : ${this.editor != parent}`)
                to_be_returned = !parent?.parentElement ? this.editor : parent?.parentElement
                // console.log(`Are they same ? : ${this.editor != parent}`)
                // console.log(`${parent?.nodeName.toLowerCase()} === ${this.getNodeTag(NodeType).toLowerCase()}`)
                console.log(`it is to be unbold ${count}`)
                count++
            }
            console.log(count, this.editor == parent, to_be_returned?.innerHTML)
            return (to_be_returned?.nodeName.toLowerCase() == this.getNodeTag(NodeType).toLowerCase() && count > 15) ? this.editor : to_be_returned
    }

    handleHighlighted(NodeType: element_tagName) {
        console.log('highlighting')
        let TAG = this.getNodeTag(NodeType).toLowerCase()
        let parentNode = window.getSelection()?.anchorNode?.parentNode
        let highlightedNode : HTMLElement|Node|null|undefined = window.getSelection()?.anchorNode  
        const range = window.getSelection()?.getRangeAt(0) ?? document.getSelection()?.getRangeAt(0)
        if(highlightedNode?.parentNode?.nodeName?.toLowerCase() == TAG) TAG = "span";
        let _text = window.getSelection()?.toString() ?? '',
            id =  `${TAG}${new Date().valueOf()}`.toLowerCase()
        const newElement = document.createElement(TAG);
        newElement.setAttribute('id', `${id}`)
        window.getSelection()?.deleteFromDocument()
        console.log(highlightedNode?.parentNode?.nodeName , TAG)
        //this is to reverse currenct state i.e from bold to unbold
        if(highlightedNode?.parentNode?.nodeName?.toLowerCase() == this.getNodeTag(NodeType).toLowerCase()){
            console.log('running this now')
            range?.commonAncestorContainer?.parentElement?.replaceWith(newElement)
        }else{
            console.log('running')
            range?.surroundContents(newElement);
        }
        newElement.innerHTML = _text
        this.updateInput().setCaret(`#${id}`)
    }

    private turnButton(NodeType: element_tagName){
        let bg_color = this.action_status[`${NodeType}`] ? '#554' : '#f0f0f0'
        let text_color = this.action_status[`${NodeType}`] ? '#f0f0f0' : '#554' 
        console.log(NodeType)
        if(!this.action_has_on_off.includes(NodeType.toLowerCase())) return this
        return this.addStyle(this.action_buttons[`${NodeType}`], `
            background:${bg_color};
            color:${text_color}
        `)
        
    }
    private updateInput(){
        this.input?.setAttribute("value", this.editor?.innerHTML ?? '');
        return this
    }

    addStyle(domElement : Element|null, style: string){
        console.log(style)
        domElement?.setAttribute('style', style)
        return this
    }

    private getNodeTag(NodeType : element_tagName){
        return this.action_tags[`${NodeType}`];
    }
    
}


export {InsertEditor}


