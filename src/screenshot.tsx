import { closeMainWindow, launchCommand, LaunchType } from "@raycast/api";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";

export default async function Screenshot() {
  // generate a known but temporary path
  const tempDir = mkdtempSync(path.join(tmpdir(), 'remindme'));
  const imageName = randomUUID();
  const imagePath = `${tempDir}/${imageName}.png`;
  console.log({ imagePath });

  // close the window to take a screenshot
  await closeMainWindow();

  try {
    execSync(`/usr/sbin/screencapture -i ${imagePath}`);
  } catch (error) {
    // TODO: error handling
    console.error(error)
  }

  console.log('image taken: ', imagePath);
  console.log('launching...');
  launchCommand({
    name: 'send',
    arguments: {
      imagePath
    },
    type: LaunchType.UserInitiated,
  }).then(() => {
    console.log('launched!')
  }).catch((err) => console.error(err))
}
