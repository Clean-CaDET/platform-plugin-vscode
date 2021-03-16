import { window } from 'vscode';

export async function enterChallengeId() {
	const result = await window.showInputBox({
		placeHolder: 'Enter the challenge ID',
        validateInput: text => {
			return text === '' || !Number(text) ? 'ID is a required number.' : null;
		}
	});

    return parseInt(result || "0");
}

export async function enterStudentId() {
	const result = await window.showInputBox({
		placeHolder: 'Enter your student index in the format XX-123-2018'
	});

    return result;
}