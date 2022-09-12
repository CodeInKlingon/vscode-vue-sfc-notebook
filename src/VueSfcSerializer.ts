import * as vscode from "vscode";
import { TextDecoder, TextEncoder } from 'util';

interface RawNotebookCell {
    language: string;
    value: string;
    kind: vscode.NotebookCellKind;
}

export class VueSfcSerializer implements vscode.NotebookSerializer {

    constructor(){
    	vscode.window.showInformationMessage("This is Serializer constructor running");

    }

    async deserializeNotebook(
        content: Uint8Array,
        _token: vscode.CancellationToken
      ): Promise<vscode.NotebookData> {
        var contents = new TextDecoder().decode(content);
    
        let raw: RawNotebookCell[];
        try {
          raw = <RawNotebookCell[]>JSON.parse(contents);
        } catch {
          raw = [];
        }
    
        const cells = raw.map(
          item => new vscode.NotebookCellData(item.kind, item.value, item.language)
        );
    
        return new vscode.NotebookData(cells);
      }
    
      async serializeNotebook(
        data: vscode.NotebookData,
        _token: vscode.CancellationToken
      ): Promise<Uint8Array> {
        let contents: RawNotebookCell[] = [];
    
        for (const cell of data.cells) {
          contents.push({
            kind: cell.kind,
            language: cell.languageId,
            value: cell.value
          });
        }
    
        return new TextEncoder().encode(JSON.stringify(contents));
      }
}