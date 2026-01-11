export const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed";
  }
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return "File size must be less than 10MB";
  }
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