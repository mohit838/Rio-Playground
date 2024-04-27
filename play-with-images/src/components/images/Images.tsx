import { ChangeEvent, useState } from "react";

const Images = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.width <= 1000 && img.height <= 876) {
            setImageFile(file);
            setImageDimensions({ width: img.width, height: img.height });
            setErrorMessage("");
          } else {
            setErrorMessage(
              "Image dimensions should not exceed 1000x876 pixels."
            );
          }
        };
        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto">
      <div>
        <input
          onChange={handleFileChange}
          type="file"
          placeholder="Upload your image"
        />
      </div>
      <div>
        {imageFile && (
          <div>
            <p>Your Image:</p>
            <img src={URL.createObjectURL(imageFile)} alt="Uploaded" />
            <p>Name: {imageFile.name}</p>
            <p>Type: {imageFile.type}</p>
            <p>Size: {imageFile.size} bytes</p>
            {imageDimensions && (
              <p>
                Dimensions: {imageDimensions.width} x {imageDimensions.height}
              </p>
            )}
          </div>
        )}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Images;
