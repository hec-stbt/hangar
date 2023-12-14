import * as vscode from "vscode";
import { ICustomRadioButton } from "./ICustomRadioButton";
import { RadioButtonDataProvider } from "./RadioButtonDataProvider";
import { HangarScripts } from "./hangarScripts";
const hangarScripts = new HangarScripts();
import { WebviewPanelCreator } from "./WebviewPanelCreator";
const webviewPanelCreator = new WebviewPanelCreator();


/**
 * Activates the VS Code extension.
 * 
 * This function is responsible for initializing the extension. It creates a new instance of HangarScripts,
 * defines the custom radio buttons and their labels, sets the button label and command, and registers the 
 * RadioButtonDataProvider as the data provider for the "radioButtons" view. It also registers a command that 
 * is executed when the button is clicked.
 * 
 * @see {@link https://code.visualstudio.com/api/references/activation-events | VS Code Activation Events}
 * 
 * @author ADCenter Spain - DevOn Hangar Team
 * @version 3.1.0
 */
export function activate(): void {
	const radioButtonDataProvider = createRadioButtonDataProvider();
	vscode.window.registerTreeDataProvider("hangar-cicd", radioButtonDataProvider);
	registerCommandHandler(radioButtonDataProvider);
	webviewPanelCreator.createWebviewPanel();
}

/**
 * Creates a radio button data provider.
 * 
 * @returns The radio button data provider.
 */
function createRadioButtonDataProvider(): RadioButtonDataProvider {
	const customRadioButtons: ICustomRadioButton[] = [
		{ id: "create-repo.sh", label: "🆙 Create repo (repositories/github)" },
		{ id: "pipeline_generator.sh", label: "⏩ Pipeline generator (pipelines/github)" }
	];

	const runButtonLabel = "RUN";
	const runButtonCommand = "hangar-cicd.runScripts";

	const documentationButtonLabel = "OPEN DOCUMENTATION";
	const documentationButtonCommand = "hangar-cicd.openDocu";

	return new RadioButtonDataProvider(customRadioButtons, runButtonLabel, runButtonCommand, documentationButtonLabel, documentationButtonCommand);
}

/**
 * Registers a command handler.
 * 
 * @param radioButtonDataProvider The radio button data provider.
 */
function registerCommandHandler(radioButtonDataProvider: RadioButtonDataProvider): void {
	vscode.commands.registerCommand("hangar-cicd.openDocu", async () => {
		webviewPanelCreator.createWebviewPanel();
	});

	vscode.commands.registerCommand("hangar-cicd.runScripts", async () => {
		let selectedScriptIds: string[] = [];
		radioButtonDataProvider.radioButtons.forEach(radioButton => {
			if (radioButton.checkboxState === vscode.TreeItemCheckboxState.Checked) {
				selectedScriptIds.push(radioButton.id as string);
			}
		});
		if (selectedScriptIds.length > 1) {
			vscode.window.showErrorMessage("ERROR: Please select only one script at a time.");
		} else if (selectedScriptIds.length === 1) {
			let scriptAttributes: string | undefined = await vscode.window.showInputBox(
				{ prompt: '✨ Enter ALL attributes separated by space ...' }
			);
			hangarScripts.scriptSelector(selectedScriptIds[0], scriptAttributes as string);
		}
	});
}