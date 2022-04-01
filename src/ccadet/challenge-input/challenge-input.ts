import { window } from 'vscode';

export async function enterChallengeId() {
	const result = await window.showInputBox({
		placeHolder: 'Unesi ID izazova (ispisan je na web prikazu Tutora)',
        validateInput: text => {
			return text === '' || !Number(text) ? 'ID je obavezno polje tipa celog broja.' : null;
		}
	});

    return parseInt(result || "0");
}

export async function enterStudentId(previousId: string) {
	const result = await window.showInputBox({
		placeHolder: 'Unesi svoj indeks u formatu XX-123-2018',
		validateInput: text => {
			return !/^([a-zA-Z]{2}-[0-9]{1,3}-[0-9]{4})$/.test(text) ? 'Indeks mora biti u formatu XX-123-2018' : null;
		},
		value: previousId
	});

    return result;
}