export const validateImageFile = (file: File): string | null => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed";
  }

  // Check file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return "File size must be less than 10MB";
  }

  // Check specific image types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
  ];
  if (!allowedTypes.includes(file.type)) {
    return "Unsupported image format";
  }

  return null;
};