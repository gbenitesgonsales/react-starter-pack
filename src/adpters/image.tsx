export function Image({ src, alt, loading = "lazy", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt || "Image"}
      loading={loading}
      {...props}
    />
  );
}