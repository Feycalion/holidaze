import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { apiPost } from "../utils/apiKey";
import { useNavigate } from "react-router-dom";

const CreateVenueSchema = Yup.object().shape({
  name: Yup.string().required("Venue name is required"),
  address: Yup.string().required("Address is required"),
  description: Yup.string().required("Description is required"),
  maxGuests: Yup.number()
    .required("Max Guests is required")
    .min(1, "At least 1 guest"),
  price: Yup.number()
    .required("Price per night is required")
    .min(1, "Price must be positive"),
  imageUrl: Yup.string().url("Invalid URL"),
});

const CreateVenuePage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: yupResolver(CreateVenueSchema),
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      media: images.map((url) => ({ url, alt: "Venue Image" })),
      price: data.price,
      maxGuests: data.maxGuests,
      meta: {
        wifi: true,
        parking: true,
        breakfast: false,
        pets: false,
      },
      location: {
        address: data.address,
      },
    };
    try {
      const response = await apiPost("/holidaze/venues", payload);

      const createdVenueId = response.data.id;
      navigate(`/venue/${createdVenueId}`);
      alert("Venue created successfully.");
    } catch (error) {
      console.log("API Error Details:", error.message || error);
      console.error("Error creating venue:", error);
      alert("Failed to create venue.");
    }
  };

  const addImage = (url) => {
    if (url && !images.includes(url)) {
      const trimmedUrl = url.trim();
      if (
        !trimmedUrl.startsWith("http://") &&
        !trimmedUrl.startsWith("https://")
      ) {
        return;
      }
      setImages((prevImages) => [...prevImages, trimmedUrl]);
      resetField("imageUrl");
    }
  };

  const removeImage = (url) => {
    setImages((prevImages) => prevImages.filter((image) => image !== url));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pt-36">
      <h1 className="text-3xl text-text mb-8">Create new venue</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Venue name
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Norwegian Cabin"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-main-red text-sm">{errors.name?.message}</p>
        </div>

        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Address
          </label>
          <input
            type="text"
            {...register("address")}
            placeholder="Road Street 148"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-main-red text-sm">{errors.address?.message}</p>
        </div>

        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="A lovely cabin in the mountains..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-main-red text-sm">{errors.description?.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text font-medium mb-1">
              Max Guests
            </label>
            <input
              type="number"
              {...register("maxGuests")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <p className="text-main-red text-sm">{errors.maxGuests?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Price per night
            </label>
            <input
              type="number"
              {...register("price")}
              placeholder="$0"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <p className="text-main-red text-sm">{errors.price?.message}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Add pictures
          </label>
          <input
            type="text"
            {...register("imageUrl")}
            placeholder="image.url"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={() =>
              addImage(document.querySelector("input[name='imageUrl']").value)
            }
            className="mt-2 bg-main-red text-background py-2 px-3 rounded"
          >
            Add Image
          </button>
          <p className="text-main-red text-sm">{errors.imageUrl?.message}</p>
        </div>

        <div className="flex space-x-4 mt-4">
          {images.map((url, index) => (
            <div key={index} className="relative w-20 h-20 bg-gray-200 rounded">
              <img
                src={url}
                alt={`Venue ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-background text-red-500 rounded-full w-5 h-5 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-main-red text-background py-3 rounded font-semibold hover:bg-red-800 transition"
        >
          Create venue
        </button>
      </form>
    </div>
  );
};

export default CreateVenuePage;
