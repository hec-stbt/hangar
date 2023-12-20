import * as vscode from "vscode";
import { execSync } from "child_process";


/**
 * Represents a script runner for a VS Code extension.
 * 
 * This class is responsible for executing scripts based on the selected radio button. It includes a method
 * for running the script associated with the given radio button ID.
 * 
 * Available scripts:
 * - 🆙 Create repo
 * - 🆕 Add secret
 * - ⏩ Pipeline generator
 *  
 * @author ADCenter Spain - DevOn Hangar Team
 * @version 3.1.0
 */
export class HangarScripts {
    /**
     * Executes the scripts associated with the given script ID.
     * 
     * This method executes the corresponding script.
     * If no script is found for a given ID, it logs an error message.
     * 
     * @param {string} scriptId - The ID of the selected script.
     * @param {string} scriptPath - The relative path of the script.
     * @param {string} scriptAttributes - The script attributes.
     * 
     * @example
     * scriptSelector('create-repo.sh', '/script/folder/path', '-a create -n repo-test -d /local/project/path');
     */
    public scriptSelector(scriptId: string, scriptPath: string, scriptAttributes: string): void {
        switch (scriptId) {
            case "create-repo.sh":
                this.createRepoSh(scriptId, scriptPath, scriptAttributes);
                break;
            case "add-secret.sh":
                this.addSecretSh(scriptId, scriptPath, scriptAttributes);
                break;
            case "pipeline_generator.sh":
                this.pipelineGeneratorSh("pipeline_generator.sh", scriptPath, scriptAttributes);
                break;
            default:
                vscode.window.showErrorMessage(`🛑 No script found for radio button ID: ${scriptId}`);
        }
    }

    /**
    * Executes a script located at the given path.
    *
    * @param {string} scriptName - The name of the script to execute.
    * @param {string} scriptPath - The path where the script is located.
    * @param {string} scriptAttributes - The scriptAttributes of the script.
    */
    private executeScript(scriptName: string, scriptPath: string, scriptAttributes: string): void {
        try {
            execSync(`cd ${scriptPath} ; ./${scriptName} ${scriptAttributes}`);
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                console.error(`Error executing script: ${error.message}`);
                vscode.window.showErrorMessage(`Error executing script: ${error.message}`);
            } else {
                console.error(`Error executing script: ${error}`);
                vscode.window.showErrorMessage(`Error executing script: ${error}`);
            }
        }
    }

    /**
    * Opens a new tab that notifies the user that the corresponding script
    * has been executed.
    *
    * @param {string} htmlContent - The html content to be displayed in the tab.
    */
    private async displayPanel(htmlContent: string): Promise<void> {
        let panel = vscode.window.createWebviewPanel(
            'infoPanel',
            'Information',
            vscode.ViewColumn.One,
            {}
        );
        panel.webview.html = htmlContent + "<br><p>You can close this tab now.</p>";
        await new Promise(resolve => setTimeout(() => {
            panel.dispose();
            resolve(null);
        }, 100));
    }

    /**
     * Asynchronously creates a repository based on the given script name and attributes.
     * 
     * @param {string} scriptName - The name of the script.
     * @param {string} scriptPath - The path of the script.
     * @param {string} scriptAttributes - The attributes for the script.
     */
    private async createRepoSh(scriptName: string, scriptPath: string, scriptAttributes: string): Promise<void> {
        if (scriptAttributes) {
            await this.displayPanel(`<h1>🆙 THE REPO HAS BEEN CREATED !!!</h1>`);
            this.executeScript(scriptName, scriptPath, scriptAttributes);
        } else {
            vscode.window.showErrorMessage("🛑 Required attributes missing");
        }
    }

    /**
    *  Uploads a file or a variable as a secret in Google Cloud Secret Manager
    *  to make it available in chosen pipelines.
    * 
    * @param {string} scriptName - The name of the script.
    * @param {string} scriptPath - The path of the script.
    * @param {string} scriptAttributes - The attributes for the script.
    */
    private async addSecretSh(scriptName: string, scriptPath: string, scriptAttributes: string): Promise<void> {
        if (scriptAttributes) {
            await this.displayPanel(`<h1>⏩ THE SECRET HAS BEEN ADDED !!!</h1>`);
            this.executeScript(scriptName, scriptPath, scriptAttributes);
        } else {
            vscode.window.showErrorMessage("🛑 Required attributes missing");
        }
    }

    /**
     *  Generates a workflow on github based on the given definition
     * 
     * @param {string} scriptName - The name of the script.
     * @param {string} scriptPath - The path of the script.
     * @param {string} scriptAttributes - The attributes for the script.
    */
    private async pipelineGeneratorSh(scriptName: string, scriptPath: string, scriptAttributes: string): Promise<void> {
        if (scriptAttributes) {
            await this.displayPanel(`<h1>⏩ THE PIPELINE HAS BEEN CREATED !!!</h1>`);
            this.executeScript(scriptName, scriptPath, scriptAttributes);
        } else {
            vscode.window.showErrorMessage("🛑 Required attributes missing");
        }
    }
}