import { useState, useEffect } from "react";


const galleryData = [
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    totalPrice: "₹ 4.50 Crore",
    area: "25 Bigha",
    pricePerBigha: "₹ 18 Lakh",
    owner: "Ramesh Patel",
    address: "Ahmedabad, Gujarat, India",
  },
  {
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    totalPrice: "₹ 4.80 Crore",
    area: "40 Bigha",
    pricePerBigha: "₹ 12 Lakh",
    owner: "Mahesh Patel",
    address: "Rajkot, Gujarat, India",
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    totalPrice: "₹ 4.50 Crore",
    area: "18 Bigha",
    pricePerBigha: "₹ 25 Lakh",
    owner: "Kishan Patel",
    address: "Surat, Gujarat, India",
  },
];

const ImageGallery = ({ onChange }) => {
  const [current, setCurrent] = useState(0);

  //  THIS IS THE FIX (page load pe data bhejna)
  useEffect(() => {
    onChange(galleryData[0]);
  }, []);

  const selectImage = (index) => {
    setCurrent(index);
    onChange(galleryData[index]);
  };

  return (
    <>
      <div className="rounded-xl overflow-hidden">
        <img
          src={galleryData[current].image}
          className="w-full h-[420px] object-cover"
          alt="Land"
        />
      </div>

      <div className="flex gap-3 mt-4">
        {galleryData.map((item, i) => (
          <img
            key={i}
            src={item.image}
            onClick={() => selectImage(i)}
            className={`w-24 h-20 rounded-md object-cover cursor-pointer border-2 ${
              current === i ? "border-emerald-600" : "border-transparent"
            }`}
            alt=""
          />
        ))}
      </div>
    </>
  );
};

export default ImageGallery;
