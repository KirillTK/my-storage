export const getFileExtension = (fileName: string) => {
  return fileName.split(".").pop();
};

export const getFileNameWithoutExtension = (fileName: string) => {
  return fileName.split(".").slice(0, -1).join(".");
};
