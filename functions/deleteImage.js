import fs from 'fs';

const deleteImage = async (imagePath) => {
  try {
    await fs.promises.unlink(imagePath);
    console.log(`Successfully deleted ${imagePath}`);
  } catch (err) {
    console.error(err);
  }
};

export default deleteImage