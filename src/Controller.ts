import * as vscode from "vscode";
import { parse, compileScript, compileTemplate } from "@vue/compiler-sfc";

import { ReplStore, File  } from '../node_modules/@vue/repl/dist/vue-repl.js';

export class Controller {
    readonly controllerId = 'vue-sfc-controller-1';
    readonly notebookType = 'vue-sfc-notebook';
    readonly label = 'VUE Notebook';
    readonly supportedLanguages = ['vue','typescript','javascript'];
  
    replStore = ReplStore;

    private readonly _controller: vscode.NotebookController;
    private _executionOrder = 0;
  
    constructor() {
      this._controller = vscode.notebooks.createNotebookController(
        this.controllerId,
        this.notebookType,
        this.label
      );
  
      this._controller.supportedLanguages = this.supportedLanguages;
      this._controller.supportsExecutionOrder = true;
      this._controller.executeHandler = this._execute.bind(this);
    }
  
    private _execute(
      cells: vscode.NotebookCell[],
      _notebook: vscode.NotebookDocument,
      _controller: vscode.NotebookController
    ): void {

      //reset repl store


      for (let cell of cells) {
        this._doExecution(cell);
      }
    }

    dispose () {}
  
    private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
      const execution = this._controller.createNotebookCellExecution(cell);
      execution.executionOrder = ++this._executionOrder;
      execution.start(Date.now()); // Keep track of elapsed time to execute cell.
  
      /* Do some execution here; not implemented */
      // let id = uuidv4();
      let store = new ReplStore();

      let vueSFC = cell.document.getText();
      
      let parsedSFC = parse(vueSFC);

      // let script = compileScript(parsedSFC.descriptor, {id: id});//.script;
      // let render = compileTemplate({
      //   source: parsedSFC.descriptor.template?.content ?? "",
      //   id: id,
      //   filename: parsedSFC.descriptor.filename
      // });

      //create file from cell
      let file = new File(parsedSFC.descriptor.filename, vueSFC);

      //add 'file' to store
      store.addFile(file);

      execution.replaceOutput([
        new vscode.NotebookCellOutput([
          vscode.NotebookCellOutputItem.text('Dummy output text!')
        ])
      ]);
      execution.end(true, Date.now());
    }
  }