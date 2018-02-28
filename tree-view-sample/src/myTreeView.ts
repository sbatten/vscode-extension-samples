import * as vscode from 'vscode';
import * as path from 'path';

import { TreeNode, CurrentTree } from './mytreemodel';
import { TreeView } from 'vscode';

export class MyTreeViewProvider implements vscode.TreeDataProvider<TreeNode> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | null> = new vscode.EventEmitter<TreeNode | null>();
	readonly onDidChangeTreeData: vscode.Event<TreeNode | null> = this._onDidChangeTreeData.event;

	private tree: TreeNode[] = CurrentTree;

	constructor(private context: vscode.ExtensionContext) {
	}

	getRandomInt(max: number): number {
		return Math.floor(Math.random() * Math.floor(max));
	}

	selectRandomElement(): TreeNode {
		let currArr = this.tree;
		while (true) {
			let idx = this.getRandomInt(currArr.length);
			let curNode = currArr[idx];
			if (!curNode.children || this.getRandomInt(2) === 0)
				return curNode;
			currArr = curNode.children;
		}
	}

	reveal(treeView: TreeView<TreeNode>): void {
		let revealNode = this.selectRandomElement();
		vscode.window.showInformationMessage('Revealing node: ' + revealNode.label);
		treeView.reveal(revealNode);
	}

	getParent(element: TreeNode): TreeNode {
		return element.parent ? element.parent : null;
	}

	getChildren(element?: TreeNode): TreeNode[] {
        if (!element) return this.tree;

        if(element.children && element.children.length > 0) return element.children;

        return null;
	}

	getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		if (element) {
			let hasChildren = element.children && element.children.length > 0;
			let treeItem: vscode.TreeItem = new vscode.TreeItem(element.label, hasChildren ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
            if (element.hasIcon && !element.useFileIconTheme) treeItem.iconPath = this.getIcon(element);
            if (element.hasIcon && element.useFileIconTheme) treeItem.resourceUri = vscode.Uri.parse(this.context.asAbsolutePath(path.join('src', 'mytreeview.ts')));
            treeItem.tooltip = this.getTooltip(element);
			return treeItem;
		}
		return null;
    }
    
    private getTooltip(node: TreeNode): string {
        let hasChildren = node.children && node.children.length > 0;
        return "This " + (hasChildren ? "container" : "item") + " has " + (node.hasIcon ? "an" : "no") + " icon";
    }

	private getIcon(node: TreeNode): any {
		if (node.label.toLocaleLowerCase().indexOf('boolean') >= 0) {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'boolean.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'boolean.svg'))
            }
		}
		if (node.label.toLocaleLowerCase().indexOf('string') >= 0) {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'string.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'string.svg'))
			}
		}
		if (node.label.toLocaleLowerCase().indexOf('number') >= 0) {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'number.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'number.svg'))
			}
        }

        return {
            light: this.context.asAbsolutePath(path.join('resources', 'light', 'number.svg')),
            dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'number.svg'))
        }
	}
}