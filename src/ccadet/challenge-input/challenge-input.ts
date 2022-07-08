import { window } from 'vscode';

export async function enterChallengeId() {
	const result = await window.showInputBox({
		placeHolder: 'Enter challenge ID (displayed on the Tutor Web UI)',
        validateInput: text => {
			return text === '' || !Number(text) ? 'ID is a required number.' : null;
		}
	});

    return parseInt(result || "0");
}

export async function enterStudentId(previousId: string) {
	const result = await window.showInputBox({
		placeHolder: 'Enter your username following the format XX-123-2018',
		validateInput: text => {
			return !/^([a-zA-Z]{2}-[0-9]{1,3}-[0-9]{4})$/.test(text) ? 'The username must comply with the format XX-123-2018' : null;
		},
		value: previousId
	});

    return result;
}