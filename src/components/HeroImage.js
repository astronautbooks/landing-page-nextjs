const HeroImage = ({ src, alt, className }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${className} float-animation`}
    />
  );
};

export default HeroImage;
