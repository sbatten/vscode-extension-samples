import { Uri } from "vscode";

export class TreeNode {
    children?: TreeNode[];
    parent?: TreeNode;
    label: string;
    hasIcon: boolean;
    useFileIconTheme?: boolean;

    constructor(label: string, hasIcon: boolean, useFileIconTheme?: boolean) {
        this.label = label;
        this.hasIcon = hasIcon;
        if (useFileIconTheme) this.useFileIconTheme = useFileIconTheme;
    }

    addChild(child: TreeNode) {
        if (!this.children)
            this.children = [child];
        else
            this.children.push(child);

        child.parent = this;
    }
}

let BasicTree: TreeNode = new TreeNode('Container with Icon Children', false);
BasicTree.addChild(new TreeNode('String Item', true));
BasicTree.addChild(new TreeNode('Boolean Item', true));

let CombinedIconTree: TreeNode = new TreeNode('Container with Icon Children', true);
CombinedIconTree.addChild(new TreeNode('String Item', false, false));
CombinedIconTree.addChild(new TreeNode('File Item', true, true));

let NoChildIconTree: TreeNode = new TreeNode('Container with No Icon Children', false);
NoChildIconTree.addChild(new TreeNode('No Icon Item', false));
NoChildIconTree.addChild(new TreeNode('No Icon Item', false));

CombinedIconTree.addChild(NoChildIconTree);

let MultiRootTree: TreeNode[] = [
    BasicTree,
    // NoChildIconTree,
    CombinedIconTree
];

export let CurrentTree = MultiRootTree;

