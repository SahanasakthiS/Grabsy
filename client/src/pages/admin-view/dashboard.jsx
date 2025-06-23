import { useEffect, useState } from "react";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImages, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector(state => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      console.warn("No image URL found");
      return;
    }

    dispatch(addFeatureImages({ image: uploadedImageUrl }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setImageFile(null);
          setUploadedImageUrl("");
        }
      });
  }

  function handleDeleteImage(id) {
    dispatch(deleteFeatureImage(id)).then(() => {
      dispatch(getFeatureImages());
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        isCustomStyling={true}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
      />

      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <div className="relative group" key={featureImgItem._id}>
              <img
                src={featureImgItem.image}
                alt="Feature"
                className="w-full h-[300px] object-cover rounded-t-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteImage(featureImgItem._id)}
                className="absolute top-2 right-2 hidden group-hover:block"
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No feature images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
