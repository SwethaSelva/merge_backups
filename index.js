let fs = require('fs');
const path = require('path');

/**
 * Eliminate the duplicate and merge old to recent backup
 * @param {String} recentBackupPath 
 * @param {String} oldBackupPath 
 */
function mergeTwoBackups(recentBackupPath, oldBackupPath) {
  if (!fs.existsSync(oldBackupPath)) return null;

  let oldBackupContents = fs.readdirSync(oldBackupPath, { withFileTypes: true });
  oldBackupContents.forEach(file => {
    let oldFilePath = path.join(oldBackupPath, file.name);
    let recentFilePath = path.join(recentBackupPath, file.name);

    if (file.isDirectory()) {
      if (!fs.existsSync(recentFilePath)) fs.mkdirSync(recentFilePath);
      mergeTwoBackups(recentFilePath, oldFilePath);
    } else {
      fs.renameSync(oldFilePath, recentFilePath);
    }
  });
  fs.rmSync(oldBackupPath, { recursive: true });
}

mergeTwoBackups("../../backup copy/picture from drive", "../../backup copy/Pictures");
