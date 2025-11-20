import { use } from "react";

const fetchFolderMetadata = async (folderId: string | null) => {
  const response = await fetch(`/api/folder?folderId=${folderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export function useFolderMetadata(folderId: string | null) {
  const data = use(fetchFolderMetadata(folderId));

  console.log(data);

  return data;
}
