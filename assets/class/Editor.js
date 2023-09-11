import Header from '@editorjs/header';
import Table from 'editorjs-table';

import AceCodeEditorJS, { AceCodeConfig } from "ace-code-editorjs";
import ace, { require } from "ace-builds";
import "ace-builds/esm-resolver";
import * as Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-coy.css";

import modeHTMLWorker from "ace-builds/src-noconflict/worker-html?url";
import modeJSWorker from "ace-builds/src-noconflict/worker-javascript?url";
import modeCSSWorker from "ace-builds/src-noconflict/worker-css?url";
import modePHPWorker from "ace-builds/src-noconflict/worker-php?url";
import Underline from '@editorjs/underline';

ace.config.setModuleUrl("ace/mode/html_worker", modeHTMLWorker);
ace.config.setModuleUrl("ace/mode/javascript_worker", modeJSWorker);
ace.config.setModuleUrl("ace/mode/css_worker", modeCSSWorker);
ace.config.setModuleUrl("ace/mode/php_worker", modePHPWorker);
import Carousel from 'editorjs-carousel';

import Tooltip from 'editorjs-tooltip';

import InlineCode from '@editorjs/inline-code';
import Checklist from '@editorjs/checklist';
import { StyleInlineTool } from 'editorjs-style';
import ChangeCase from 'editorjs-change-case';
import Hyperlink from 'editorjs-hyperlink';
import TextSpolier from 'editorjs-inline-spoiler-tool';
import Strikethrough from '@sotaproject/strikethrough';
import ColorPlugin  from 'editorjs-text-color-plugin';
import TextVariantTune from '@editorjs/text-variant-tune';
import Undo from 'editorjs-undo';
import LinkTool from '@editorjs/link';
import NestedList from '@editorjs/nested-list';
import TelegramPost from 'editorjs-telegram-post';

const aceConfig = {
    languages: {
      plain: {
        label: "Plain Text",
        mode: "ace/mode/plain_text",
      },
      html: {
        label: "HTML",
        mode: "ace/mode/html",
      },
      javascript: {
        label: "JavaScript",
        mode: "ace/mode/javascript",
      },
      css: {
        label: "CSS",
        mode: "ace/mode/css",
      },
      php: {
        label: "PHP",
        mode: "ace/mode/php",
      },
      jsx: {
        label: "JSX",
        mode: "ace/mode/jsx",
      },
      tsx: {
        label: "TSX",
        mode: "ace/mode/tsx",
      },
      typescript: {
        label: "TypeScript",
        mode: "ace/mode/typescript",
      },
      sql: {
        label: "SQL",
        mode: "ace/mode/sql",
      },
    },
    options: {
      fontSize: 16,
      minLines: 4,
      theme: "ace/theme/monokai",
    },
};
  
const initialValue = {
  time: 1688216184926,
  blocks: [
      {
      id: "UidmH8dcer",
      type: "code",
      data: {
          code: "<?php\nfunction removeSpace(string $str): string {\n    return str_replace(' ', '', $str);\n}\n?>",
          language: "php",
      },
      },
  ],
  version: "2.27.2",
};

const Editor = {
    tools : {
        header: Header,
        list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            },
        }, table: {
            class: Table,
        }, underline: Underline,
        Strikethrough,
        code: {
            class: AceCodeEditorJS,
            config: aceConfig,
        }, changeCase: {
          class: ChangeCase,
          config: {
            showLocaleOption: true, // enable locale case options
            locale: 'tr' // or ['tr', 'TR', 'tr-TR']
          }
        }, tooltip: {
            class: Tooltip,
            config: {
              location: 'left',
              highlightColor: '#FFEFD5',
              underline: true,
              backgroundColor: '#154360',
              textColor: '#FDFEFE',
              holder: 'editorId',
            }
        }, Color: {
            class: ColorPlugin,
            config: {
               colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
               defaultColor: '#FF1300',
               type: 'text', 
               customPicker: true // add a button to allow selecting any colour  
            }     
        }, Marker: {
            class: ColorPlugin,
            config: {
               defaultColor: '#FFBF00',
               type: 'marker',
               icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
            }, shortcut: 'CMD+SHIFT+M',
        }, inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        }, checklist: {
          class: Checklist,
          inlineToolbar: true,
        }, hyperlink: {
            class: Hyperlink,
            config: {
              shortcut: 'CMD+L',
              target: '_blank',
              rel: 'nofollow',
              availableTargets: ['_blank', '_self'],
              availableRels: ['author', 'noreferrer'],
              validate: false,
            }
        }, TextSpolier, 
        style: StyleInlineTool,
        textVariant: TextVariantTune,
        linkTool: {
            class: LinkTool,
            config: {
              endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
            }
        }, TelegramPost, carousel: {
            class: Carousel,
            config: {
                endpoints: {
                    byFile: "URL_FETCH",
                }
            }
        },
    },
    onReady: () => {
        new Undo({ editor });
    },
}

export default Editor;