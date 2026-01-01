import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const provider = new FeatureProvider(context);
    vscode.window.registerTreeDataProvider('featureList', provider);

    // 1. ADD FEATURE
    context.subscriptions.push(
        vscode.commands.registerCommand('feature-tracker.addFeature', async () => {
            const val = await vscode.window.showInputBox({ prompt: "Naya feature kya dala?" });
            if (val) provider.addFeature(val);
        })
    );

    // 2. EDIT FEATURE
    context.subscriptions.push(
        vscode.commands.registerCommand('feature-tracker.editFeature', async (item: FeatureItem) => {
            const newVal = await vscode.window.showInputBox({ 
                prompt: "Feature ka naya naam likhain",
                value: item.label 
            });
            if (newVal) provider.editFeature(item.label, newVal);
        })
    );

    // 3. DELETE FEATURE
    context.subscriptions.push(
        vscode.commands.registerCommand('feature-tracker.deleteFeature', async (item: FeatureItem) => {
            const confirm = await vscode.window.showWarningMessage(
                `Kya aap '${item.label}' ko delete karna chahte hain?`, 
                { modal: true }, 
                'Yes'
            );
            if (confirm === 'Yes') provider.deleteFeature(item.label);
        })
    );
}

class FeatureProvider implements vscode.TreeDataProvider<FeatureItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<FeatureItem | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void { this._onDidChangeTreeData.fire(); }

    getTreeItem(element: FeatureItem): vscode.TreeItem { return element; }

    getChildren(): FeatureItem[] {
        const features = this.context.workspaceState.get<string[]>('list', []);
        return features.map(f => new FeatureItem(f));
    }

    addFeature(name: string) {
        const features = this.context.workspaceState.get<string[]>('list', []);
        features.push(name);
        this.context.workspaceState.update('list', features);
        this.refresh();
    }

    editFeature(oldName: string, newName: string) {
        let features = this.context.workspaceState.get<string[]>('list', []);
        const index = features.indexOf(oldName);
        if (index !== -1) {
            features[index] = newName;
            this.context.workspaceState.update('list', features);
            this.refresh();
        }
    }

    deleteFeature(name: string) {
        let features = this.context.workspaceState.get<string[]>('list', []);
        features = features.filter(f => f !== name);
        this.context.workspaceState.update('list', features);
        this.refresh();
    }
}

class FeatureItem extends vscode.TreeItem {
    constructor(public readonly label: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon('check');
        this.description = "Done";
        // Yeh line zaroori hai taake Buttons show hon
        this.contextValue = 'featureItem'; 
    }
}