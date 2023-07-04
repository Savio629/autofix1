import * as vscode from 'vscode';

interface QuickFixOption {
  message: string;
  errorCheck: string;
  quickfix: {
    text: string;
    type: string;
  };
}

interface CustomCodeAction extends vscode.CodeAction {
  [key: string]: any;
}

export function createFix(
  document: vscode.TextDocument,
  range: vscode.Range,
  errorCode: string,
  option: QuickFixOption,
  quickFixes: { [errorCode: string]: QuickFixOption[] }
): vscode.CodeAction | undefined {
  const { message, quickfix } = option;

  const fix: CustomCodeAction = new vscode.CodeAction(
    quickfix.text,
    vscode.CodeActionKind.QuickFix
  );
  fix.edit = new vscode.WorkspaceEdit();

  if (quickfix.type === 'update') {
    // Replace the version within the range
    fix.edit.replace(document.uri, range, quickfix.text);
  }else if (quickfix.type === 'delete') {
    // Delete the last line within the range
    const lastLine = document.lineAt(range.end.line);
    const deletionRange = lastLine.range;
    fix.edit.delete(document.uri, deletionRange);
  } else if (quickfix.type === 'append') {
    // Append '-1' to the duplicate name value
    const line = document.lineAt(range.start.line);
    const lineText = line.text;

    // Find the position of the duplicate name value
    const nameStartIndex = lineText.indexOf(': "') + 3;
    const nameEndIndex = lineText.lastIndexOf('"');

    if (nameStartIndex !== -1 && nameEndIndex !== -1) {
      const existingNameValue = lineText.substring(nameStartIndex, nameEndIndex);
      const newNameValue = `${existingNameValue}-1`;
      //vscode.window.showInformationMessage(`Existing Name: ${existingNameValue}, New Name: ${newNameValue}`);
      // Replace the existing name value with the appended one
      const nameValueRange = new vscode.Range(
        range.start.line,
        nameStartIndex,
        range.start.line,
        nameEndIndex
      );
      fix.edit.replace(document.uri, nameValueRange, newNameValue);
    }
    
  }else if (quickfix.type === 'add') {
    const line = document.lineAt(range.start.line);
    const lineText = line.text;
    if (lineText.includes('contact:')) {
      // Insert the quick fix text under 'contact' 
      const indentation = lineText.match(/^\s*/)?.[0] || '';
      const insertionPosition = line.range.end;
      const insertionText = `\n${indentation}  ${quickfix.text}`;

      fix.edit.insert(document.uri, insertionPosition, insertionText);
    } else if (errorCode === 'asyncapi-schema') {
    if (lineText.includes(':')) {
      // Insert the quick fix text after the ':' 
      // const indentation = lineText.match(/^\s*/)?.[0] || '';
      const insertionPosition = line.range.end;
      const insertionText = ` ${quickfix.text}`;

      fix.edit.insert(document.uri, insertionPosition, insertionText);
    }
  }
  }

  // Set the error message as the code action's title
  fix.title = message;

  // Add type field to code action metadata
  fix.type = quickfix.type;

  return fix;
}
