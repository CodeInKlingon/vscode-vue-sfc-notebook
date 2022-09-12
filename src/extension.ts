// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { VueSfcSerializer } from './VueSfcSerializer';
import { Controller } from './Controller';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	vscode.window.showInformationMessage("This is extension activation function running");
	
	context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer('vue-sfc-notebook', new VueSfcSerializer())
	);
	context.subscriptions.push(new Controller());

}

// this method is called when your extension is deactivated
export function deactivate() {}
