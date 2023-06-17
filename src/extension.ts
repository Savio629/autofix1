import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('spectral-extension');
  
	vscode.workspace.onDidOpenTextDocument((document) => {
	  if (document.languageId === 'yaml' || document.languageId === 'yml') {
		const problems = vscode.languages.getDiagnostics(document.uri);
		const spectralProblems = problems.filter((problem) => problem.source === 'spectral');
  
		spectralProblems.forEach((problem) => {
		  const { range } = problem;
  
		  const diagnostic = new vscode.Diagnostic(
			range,
			problem.message,
			vscode.DiagnosticSeverity.Error
		  );
  
		  diagnostic.source = problem.source;
		  diagnostic.code = problem.code;
  
		  const quickFix = new vscode.CodeAction('Dummy Quick Fix', vscode.CodeActionKind.QuickFix);
		  quickFix.diagnostics = [diagnostic];
		  quickFix.isPreferred = true;
  
		  quickFix.edit = new vscode.WorkspaceEdit();
		  quickFix.edit.replace(document.uri, range, 'Dummy Fix');
  
		  quickFix.command = {
			command: 'spectralExtension.showQuickFixMessage',
			title: 'Show Quick Fix Message',
			tooltip: 'This is a dummy quick fix command',
		  };
  
		  vscode.languages.registerCodeActionsProvider(document.uri, {
			provideCodeActions() {
			  return [quickFix];
			},
		  });
		});
  
		if (spectralProblems.length > 0) {
		  vscode.window.showInformationMessage('Hi spectral');
		}
	  }
	});
  
	vscode.workspace.onDidChangeTextDocument((event) => {
	  const document = event.document;
	  if (document.languageId === 'yaml' || document.languageId === 'yml') {
		const problems = vscode.languages.getDiagnostics(document.uri);
		const spectralProblems = problems.filter((problem) => problem.source === 'spectral');
  
		spectralProblems.forEach((problem) => {
		  const { range } = problem;
  
		  const diagnostic = new vscode.Diagnostic(
			range,
			problem.message,
			vscode.DiagnosticSeverity.Error
		  );
  
		  diagnostic.source = problem.source;
		  diagnostic.code = problem.code;
  
		  const quickFix = new vscode.CodeAction('Dummy Quick Fix', vscode.CodeActionKind.QuickFix);
		  quickFix.diagnostics = [diagnostic];
		  quickFix.isPreferred = true;
  
		  quickFix.edit = new vscode.WorkspaceEdit();
		  quickFix.edit.replace(document.uri, range, 'Dummy Fix');
  
		  quickFix.command = {
			command: 'spectralExtension.showQuickFixMessage',
			title: 'Show Quick Fix Message',
			tooltip: 'This is a dummy quick fix command',
		  };
  
		  vscode.languages.registerCodeActionsProvider(document.uri, {
			provideCodeActions() {
			  return [quickFix];
			},
		  });
		});
  
		if (spectralProblems.length > 0) {
		  vscode.window.showInformationMessage('Hi spectral');
		}
	  }
	});
  
	context.subscriptions.push(diagnosticCollection);
  
	// Register command to show quick fix message
	context.subscriptions.push(
	  vscode.commands.registerCommand('spectralExtension.showQuickFixMessage', () => {
		vscode.window.showInformationMessage('This is a dummy quick fix!');
	  })
	);
  }