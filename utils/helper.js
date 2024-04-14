import { supportedMimeType } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";

export const imageValidator = (size, mime) => {
  if (bytesToMb(size) > 2) {
    return "Image size cannot be more than 2 MB.";
  } else if (!supportedMimeType.includes(mime)) {
    return "Unsupported file type.";
  }
  return null;
};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const generateUniqueId = () => {
  return uuidv4();
};

export function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
}
