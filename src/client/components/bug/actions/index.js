const AddPhotos = (newValue) => {
    return {
      type: 'ADD_PHOTOS',
      payload: newValue
    };
  };

  const DropPhotos = () => {
    return {
      type: 'DROP_PHOTOS',
    };
  };

  const DropPhoto = ( index ) => {
    return {
      index : index,
      type  : 'DROP_PHOTO_ONLY'
    }
  }

export {
    AddPhotos,
    DropPhotos,
    DropPhoto
}