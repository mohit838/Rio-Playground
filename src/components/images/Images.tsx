import { ChangeEvent, useCallback, useEffect, useState } from "react";

const Images = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(
    null
  );
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Cleanup URL object when the image changes or the component unmounts
  useEffect(() => {
    return () => {
      if (optimizedImageUrl) {
        URL.revokeObjectURL(optimizedImageUrl);
      }
    };
  }, [optimizedImageUrl]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];

      if (file) {
        // Check if the uploaded file is an image
        if (!file.type.startsWith("image/")) {
          setErrorMessage("Please upload a valid image file.");
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 876;
            let { width, height } = img;

            // Calculate the optimal width and height while preserving aspect ratio
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
              if (width / height > MAX_WIDTH / MAX_HEIGHT) {
                height = (MAX_WIDTH * height) / width;
                width = MAX_WIDTH;
              } else {
                width = (MAX_HEIGHT * width) / height;
                height = MAX_HEIGHT;
              }
            }

            // Create a canvas to resize the image
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);

              // Convert the canvas image to a Blob (or base64 for smaller file sizes)
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    setOptimizedImageUrl(url);
                    setImageFile(file);
                    setImageDimensions({ width, height });
                    setErrorMessage("");
                  }
                },
                file.type,
                0.8 // Compression quality (0.0 to 1.0, 0.8 means 80% quality)
              );
            }
          };
          img.src = e.target?.result as string;
        };

        reader.readAsDataURL(file);
      }
    },
    []
  );

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
        {imageFile && optimizedImageUrl && (
          <div>
            <p>Your Optimized Image:</p>
            <p>Name: {imageFile.name}</p>
            <p>Type: {imageFile.type}</p>
            <p>Size: {imageFile.size} bytes</p>
            {imageDimensions && (
              <p>
                Optimized Dimensions: {imageDimensions.width} x
                {imageDimensions.height}
              </p>
            )}
            <img src={optimizedImageUrl} alt="Optimized" />
          </div>
        )}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Images;
