import { v2 as cloudinary } from 'cloudinary';

const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    throw new Error('Xoá ảnh thất bại');
  }
};

export default deleteImage;
