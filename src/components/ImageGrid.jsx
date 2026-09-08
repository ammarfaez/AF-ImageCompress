import ImageCard from './ImageCard';

const ImageGrid = ({ images, format, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            format={format}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
