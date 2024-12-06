let fs = require('fs');
const path = require('path');

/**
 * Function to merge two directories - Eliminate the duplicate and merge old to recent backup
 * @param {String} recentBackupPath 
 * @param {String} oldBackupPath 
 */
function mergeTwoFolders(folderAPath, folderBPath) {
  if (!fs.existsSync(folderBPath)) return null; // Exit if second folder doesn't exist

  // Read contents of the second folder
  fs.readdirSync(folderBPath, { withFileTypes: true }).forEach(file => {
    const folderBFilePath = path.join(folderBPath, file.name);
    const folderAFilePath = path.join(folderAPath, file.name);

    if (file.isDirectory()) {
      // Ensure directory exists in the first folder
      if (!fs.existsSync(folderAFilePath)) fs.mkdirSync(folderAFilePath);
      // Recursively merge subdirectories
      mergeTwoFolders(folderAFilePath, folderBFilePath);
    } else {
      // If file doesn't exist in the first folder, move it
      if (!fs.existsSync(folderAFilePath)) {
        fs.renameSync(folderBFilePath, folderAFilePath);
      }
    }
  });

  // Cleanup: Remove the second folder after merging
  fs.rmSync(folderBPath, { recursive: true, force: true });
}

mergeTwoFolders("../../backup copy/picture from drive", "../../backup copy/Pictures");
