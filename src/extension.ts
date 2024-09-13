// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import cp from "child_process";
import path from "path";
import fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposableOpen = vscode.commands.registerCommand(
    "run.run_command",
    (file) => {
      let directoryPath;

      // Проверяем, является ли file.fsPath директорией
      if (fs.lstatSync(file.fsPath).isDirectory()) {
        // Если это директория, используем ее как есть
        directoryPath = file.fsPath;
      } else {
        // Если это файл, получаем его директорию
        directoryPath = path.dirname(file.fsPath);
      }

      // Получаем команду из настроек
      const config = vscode.workspace.getConfiguration("runCommand");
      const commandTemplate = config.get(
        "command",
        'xfce4-terminal --working-directory="${directoryPath}" -e mc'
      );

      // Подставляем путь к директории в команду
      const command = commandTemplate.replace(
        "${directoryPath}",
        directoryPath
      );

      // Запускаем команду
      cp.exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(`Ошибка при запуске команды: ${stderr}`);
          return;
        }
        console.log(`Команда запущена: ${stdout}`);
      });
    }
  );

  context.subscriptions.push(disposableOpen);
}

// This method is called when your extension is deactivated
export function deactivate() {}
