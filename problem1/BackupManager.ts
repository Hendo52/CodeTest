import { BaseBackupManager } from './lib/BaseBackupManager';

export class BackupManager extends BaseBackupManager {
	/**
	 * Renames a file to a backup location.
	 *
	 * The backup location is in the same directory as the original file,
	 *  but the backup will have a numerical suffix appended to the name.
	 *  eg. "file.txt" -> "file.txt.1"
	 *
	 * When a file already exists at the backup location, it will be renamed
	 *  with the next available suffix.
	 *  eg. "file.txt.1" -> "file.txt.2", "file.txt.2" -> "file.txt.3"
	 *
	 * This way the lowest numbered backup is the most recent.
	 *
	 * This is primarily used to keep log files from getting too big.
	 *
	 * @param file The file to backup.
	 * @returns True if the backup was successful, false otherwise.
	 * @throws Error if the file does not exist or could not be read
	 */
	rollingBackup(path: string): boolean {
		const lastChar: string = path[path.length - 1];
		if (this.api.fileExists(path)) {
			//  if the last character is not a number,
			if (isNaN(parseInt(lastChar))) {
				let i = 1;
				let j = 0;

				while (this.api.fileExists(path + '.' + i)) {
					while (this.api.fileExists(path + '.' + j + 1)) {}
					//the next slot is clear but the current spot is taken
					//bump = true;
					i++;
				}
				return this.api.copyFile(path, path + '.' + i);
			} else {
				//default condition
				return this.api.copyFile(path, path + '.1');
			}
		} else {
			console.log('reached the is a number condition');
			//maybe there is an extra '.' here
			return this.api.copyFile(
				path,
				path.substring(0, path.length - 1) +
					'.' +
					parseInt(lastChar) +
					1
			);

			//  if the last character is a number, create a new name.
			// New name is the old name minus the last character, plus a number which is one more than lastchar
		}
	}
	//this is where my function go

	private generateTheList(name: string) {
		let k = 0;
		const fileList: [number, string][] = [];

		while (this.api.fileExists(name + '.' + k + 1)) {
			fileList.push([k + 1, name + '.' + k + 1]);
			k++;
		}

		return fileList;
	}
	private bumpTheList(fileList: Array<[number, string]>) {
		const reversedList = fileList.slice(0, -1).reverse();
		for (const item of reversedList) {
			this.api.moveFile(
				item[1],
				item[1].substring(0, item[1].length - 1) + item[0] + 1
			);
		}
	}
}
