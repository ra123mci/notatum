
import EditorJS from '@editorjs/editorjs';
import Api from './Api';
import Editor from './Editor';
    
export default class Page {

    /** @type {Array<HTMLAnchorElement>} */
    anchorPages;

    /** @type {HTMLAnchorElement} */
    currentAnchorPage;
    
    /** @type {HTMLAnchorElement} */
    clickedAnchorPage;
    
    /** @type {HTMLDivElement} */
    contextMenu;

    /** @type {string} */
    editorName

    /** @type {HTMLInputElement} */
    editorInputTitle

    /** @type {EditorJS} */
    editor

    /** @type {string} */
    pageId

    /** 
     * @type {{
     *  id: string
     *  title: string
     *  content: {
     *    contributors:{
     *      username: string
     *    }[]
     *    rating: number
     *    body: string
     *  }
     * }} 
     * */
    currentPage

    constructor({editorName = 'mcisme', editorSaver = 'mcisme-saver', editorTitle = 'mcisme-title', editorCreate = 'mcisme-create', contextMenu = 'mcisme-contextmenu'}) {
        this.enableDropdowns();
        this.pageId = window.location.pathname.split('/').pop();
        this.editorInputTitle = document.getElementById(editorTitle);
        this.anchorPages = Array.from(document.querySelectorAll('[data-anchor="page"]'));
        this.currentAnchorPage = this.anchorPages.find(anchorPage => anchorPage.dataset.id === this.pageId)
        this.editorName = editorName
        this.contextMenu = document.getElementById(contextMenu)
        
        this.anchorPages.forEach(anchorPage => {
          anchorPage.addEventListener('contextmenu', e => {
            this.clickedAnchorPage = anchorPage;
            e.preventDefault(); this.showContextMenu(e);
          }); anchorPage.addEventListener('click', async e => {
              this.anchorPages.forEach(_anchorPage => _anchorPage.className = 'flex items-center w-full p-1 rounded hover:bg-gray-400/50');
              anchorPage.className = "bg-gray-300 flex items-center p-1 rounded w-full";
              e.preventDefault(); 
              await this.saveCurrentPage();
              history.pushState({}, "", anchorPage.getAttribute("href"));
              this.pageId = anchorPage.dataset.id;
              this.currentAnchorPage = this.anchorPages.find(anchorPage => anchorPage.dataset.id === this.pageId)
              await this.refreshEditor();
          })
        });

        document.querySelector('body').addEventListener('click', e => {
          this.contextMenu.style.display = 'none';
        }, true);

        this.contextMenu.querySelector('[data-context-menu="delete"]').addEventListener('click', async e => {
          await this.deletePage()
        });
        
        document.getElementById(editorSaver).addEventListener('click', async () => {
          await this.saveCurrentPage()
        })
        document.getElementById(editorCreate).addEventListener('click', async () => {
          await this.addPage()
        })
        window.addEventListener('beforeunload', async () => {
          await this.saveCurrentPage()
        })

        this.editorInputTitle.addEventListener('keyup', e => {
          document.title = (this.currentAnchorPage.querySelector('[data-anchor-title="page"]').innerText = e.target.value.lenght === 0 ? 'Sans Titre' : e.target.value) + ' | Notatum'
        })
    }

    async saveCurrentPage () {
      const data = {
        title: this.currentAnchorPage.querySelector('[data-anchor-title="page"]').innerText,
        content: (await this.editor.save()).blocks
      }
      if(data.content.length === 0 && data.title.toLowerCase() === 'Sans Titre'.toLowerCase()){
        this.clickedAnchorPage = this.currentAnchorPage;
        await this.deletePage(false);
      } else await Api.patch(`/api/pages/${this.pageId}`, JSON.stringify(data))
    }

    async fetchCurrentPage () {
      return this.currentPage = (await Api.get(`/api/pages/${this.pageId}`)).data
    }

    async addPage() {
      
      const pageId = (await Api.post('/api/pages')).data.id
      const element = document.createElement('li');

      element.innerHTML = `<a data-anchor="page" data-id="${pageId}" class="flex items-center w-full p-1 rounded hover:bg-gray-400/50" href="/page/${pageId}#">
          <span class="ml-2 text-sm font-medium w-64" data-anchor-title="page">Sans titre</span>
      </a>`

      this.currentAnchorPage.parentElement.parentElement.appendChild(element);
      this.freshDropdowns();
    }

    /**
     * 
     * @param {Boolean} reloaded 
     */
    async deletePage(reloaded = true) {
      const pageId = this.clickedAnchorPage.dataset.id;
      const response = await Api.delete(`/api/pages/${pageId}`)

      if(pageId == this.pageId && reloaded) window.location.reload()
      this.clickedAnchorPage.remove();
      this.freshDropdowns();
    }

    enableDropdowns() {
        let dropdowns = document.querySelectorAll('[data-dropdown]');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', event => {
                event.preventDefault();
                this.togleDropdowns(dropdown);
            }); this.togleDropdowns(dropdown);
            if(dropdown.dataset.dropdownVisible !== undefined && dropdown.dataset.dropdownVisible !== false)
                this.togleDropdowns(dropdown);
        });
    }

    freshDropdowns() {
        let dropdowns = document.querySelectorAll('[data-dropdown]');
        dropdowns.forEach(dropdown => {
            document.querySelectorAll('#'+dropdown.dataset.dropdown).forEach( element => { 
                if(element.dataset.height !== element.scrollHeight) {
                    element.dataset.height = element.scrollHeight;
                    if(element.style.height != '0px') element.style.height = element.scrollHeight+'px';
                }
            });
        });
    }

    /**
     * 
     * @param {HTMLElement} dropdown 
     */
    togleDropdowns(dropdown) {
        document.querySelectorAll('#'+dropdown.dataset.dropdown).forEach( element => { 
            if(!element.dataset.height){
              element.style.overflow = 'hidden';
              element.style.transition = '.1s height ease-in .3s';
              element.dataset.height = element.scrollHeight;
              element.style.height = '0px';
            } else element.style.height = (element.style.height !== '0px' ? '0' : element.dataset.height) + 'px';
        });
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    showContextMenu(e){
      this.contextMenu.style.top = `${e.clientY}px`;
      this.contextMenu.style.left = `${e.clientX}px`;
      this.contextMenu.style.display = 'block';
    }

    async initEditor() {
        await this.fetchCurrentPage();
        this.editor = new EditorJS({
            holder: this.editorName,
            logLevel: 'ERROR',
            data: {
                blocks: this.currentPage.content?.body || []
            }, tools: Editor.tools
        });
    }

    async refreshEditor() {
      this.editor?.destroy();
      await this.initEditor();
      document.title = (this.currentAnchorPage.querySelector('[data-anchor-title="page"]').innerText = this.editorInputTitle.value = this.currentPage.title) + ' | Notatum'     
    }
}