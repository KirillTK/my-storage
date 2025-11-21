import { ErrorMessage } from "./error-message";

export function UnsupportedPreview() {
  return (
    <ErrorMessage
      title="Preview not available for this file type"
      description="Please download the file to view it"
    />
  );
}
