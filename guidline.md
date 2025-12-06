      <MediaCard onSelectionChange={handleSelectionChange} />
const [selectedImages, setSelectedImages] = useState<{ id: string; url: string }[]>([]);

  const handleSelectionChange = (selected: { id: string; url: string }[]) => {
    setSelectedImages(selected);
    console.log("Selected images:", selected);
  };