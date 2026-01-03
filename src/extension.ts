import * as vscode from 'vscode';

// Global variables tracking ke liye
let pendingClassName: string | undefined;
let lastKnownRange: vscode.Range | undefined;

export function activate(context: vscode.ExtensionContext) {
    const provider = new FeatureProvider(context);
    vscode.window.registerTreeDataProvider('featureList', provider);

    // --- CURSOR-OUT AUTOMATION ---
    // Ye tab chalta hai jab cursor ki position badalti hai
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(event => {
            const editor = event.textEditor;
            const document = editor.document;
            const position = event.selections[0].active; // Cursor ki mojooda jagah
            
            const lineText = document.lineAt(position.line).text;
            // Sirf Div ki class detect karne ka Regex
            const divRegex = /<div\s+class=["']([^"']+)["']/g;

            let match;
            let isCursorInsideAnyClass = false;

            while ((match = divRegex.exec(lineText)) !== null) {
                const className = match[1];
                const classStart = match.index + match[0].indexOf(className);
                const classEnd = classStart + className.length;
                
                // Cursor ki range check karna
                const range = new vscode.Range(position.line, classStart, position.line, classEnd);

                if (range.contains(position)) {
                    // Agar cursor class ke andar hai
                    isCursorInsideAnyClass = true;
                    pendingClassName = className;
                    lastKnownRange = range;
                    break;
                }
            }

            // LOGIC: Agar pehle cursor kisi class mein tha aur ab bahar aa gaya hai
            if (!isCursorInsideAnyClass && pendingClassName) {
                provider.addFeature(`Div: ${pendingClassName}`, true);
                pendingClassName = undefined; // Reset tracking
                lastKnownRange = undefined;
            }
        })
    );

    // --- MANUAL COMMANDS (Waisi hi hain) ---
    context.subscriptions.push(
        vscode.commands.registerCommand('feature-tracker.addFeature', async () => {
            const val = await vscode.window.showInputBox({ prompt: "What new feature you added?" });
            if (val) provider.addFeature(val);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('feature-tracker.editFeature', async (item: FeatureItem) => {
            const newVal = await vscode.window.showInputBox({ 
                prompt: "name your new feature",
                value: item.label 
            });
            if (newVal) provider.editFeature(item.label, newVal);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('feature-tracker.deleteFeature', async (item: FeatureItem) => {
            const confirm = await vscode.window.showWarningMessage(
                `Do you want to delete '${item.label}'?`, { modal: true }, 'Yes'
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

    addFeature(name: string, isAuto: boolean = false) {
        const features = this.context.workspaceState.get<string[]>('list', []);
        if (!features.includes(name)) {
            features.push(name);
            this.context.workspaceState.update('list', features);
            this.refresh();
            if (!isAuto) {
                vscode.window.showInformationMessage(`Feature '${name}' added!`);
            }
        }
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
        this.contextValue = 'featureItem'; 
    }
}