import React, { useState, useEffect } from 'react';
import { Button, Breadcrumb, Row, Col, Card } from 'react-bootstrap';
import { Formik, Form as FormikForm } from 'formik';
import { Link } from 'react-router-dom';
import { fetchHomeMediaSettings, updateHomeMediaSettings } from '../../../services/HomeMediaApi';
import { showSuccessToast, deleteConfirmation, showFailureToast } from '../toastsAlert/Alert.jsx';


const ImagePreview = ({ src, onDelete }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const imageUrlBase = import.meta.env.VITE_APP_IMG_URL;

    if (typeof src === 'string' && !imageUrlBase) {
      console.error(
        "ERROR: VITE_APP_IMAGE_URL is not defined in your .env file. " +
        "Please add it and restart the Vite server."
      );
      setPreviewUrl(''); 
      return;
    }

    if (typeof src === 'string' && src) {
      // === THE FIX IS HERE ===
      // Added a "/" to correctly join the base URL and the image path.
      setPreviewUrl(imageUrlBase + "/" + src);
    } else if (src instanceof File) {
      const objectUrl = URL.createObjectURL(src);
      setPreviewUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [src]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="preview"
          width="150"
          height="100"
          style={{ objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      ) : (
        <div style={{ width: 150, height: 100, border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          No Preview
        </div>
      )}
      <button
        onClick={onDelete}
        type="button"
        style={{
          position: 'absolute', top: -10, right: -10, background: 'red', color: 'white',
          border: 'none', cursor: 'pointer', borderRadius: '50%', width: 24, height: 24,
          fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        X
      </button>
    </div>
  );
};


const HomeMedia = () => {
  const [initialSettings, setInitialSettings] = useState({
    homepageBackgrounds: { recentlyAdded: [], wildlifeSafari: [], safariPhotos: [] },
  });

  const [newFiles, setNewFiles] = useState({
    recentlyAddedImages: [], wildlifeSafariImages: [], safariPhotosImages: [],
  });
  
  const [loading, setLoading] = useState(true);

  // Reusable function to fetch the latest settings from the server
  const getSettingsData = () => {
    setLoading(true);
    fetchHomeMediaSettings()
      .then(res => {
        if (res?.data?.status && res.data.data) {
          const settings = res.data.data;
          if (!settings.homepageBackgrounds) {
            settings.homepageBackgrounds = { recentlyAdded: [], wildlifeSafari: [], safariPhotos: [] };
          }
          setInitialSettings(settings);
        } else {
            showFailureToast("Could not load settings data.");
        }
      })
      .catch(err => {
        console.error("Error fetching settings:", err);
        showFailureToast("An error occurred while fetching settings.");
      })
      .finally(() => setLoading(false));
  };

  // Fetch settings on initial component mount
  useEffect(() => {
    getSettingsData();
  }, []);

  // Handler for when a user selects new files to upload
  const handleFileChange = (e, categoryKey) => {
    setNewFiles(prev => ({
      ...prev,
      [categoryKey]: [...prev[categoryKey], ...Array.from(e.target.files)],
    }));
  };

  // Handler for deleting an image that is already saved on the server
  const handleDeleteExistingImage = (category, imagePathToDelete) => {
    deleteConfirmation(() => {
      // This callback runs only if the user confirms the deletion
      setInitialSettings(prev => ({
        ...prev,
        homepageBackgrounds: {
          ...prev.homepageBackgrounds,
          [category]: prev.homepageBackgrounds[category].filter(img => img !== imagePathToDelete),
        },
      }));
      showSuccessToast("Image marked for deletion. Click 'Save All Changes' to confirm.");
    });
  };

  // Handler for deleting a newly selected image before it is uploaded
  const handleDeleteNewImage = (categoryKey, fileToDelete) => {
    setNewFiles(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter(file => file !== fileToDelete),
    }));
  };
  
  // Main submission handler that saves all changes
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    
    formData.append('existingHomepageBackgrounds', JSON.stringify(initialSettings.homepageBackgrounds));
    
    Object.keys(newFiles).forEach(categoryKey => {
      newFiles[categoryKey].forEach(file => {
        formData.append(categoryKey, file);
      });
    });

    try {
      const res = await updateHomeMediaSettings(formData);
      if (res?.data?.status) {
        showSuccessToast(res.data.message || 'Homepage Media updated successfully!');
        
        // Clear the file input fields visually
        document.getElementById('recentlyAddedInput').value = "";
        document.getElementById('wildlifeSafariInput').value = "";
        document.getElementById('safariPhotosInput').value = "";

        // Reset the staged files state and refresh data from the server
        setNewFiles({ recentlyAddedImages: [], wildlifeSafariImages: [], safariPhotosImages: [] });
        getSettingsData();
      } else {
        showFailureToast(res?.data?.message || 'An unknown error occurred while saving.');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showFailureToast("Could not save settings. Please check the console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !initialSettings.homepageBackgrounds) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <Card>
        <Card.Header>
          <Row className="mb-0 align-items-center">
            <Col><h5>Homepage "Junglore Moments" Backgrounds</h5></Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={{}}
            onSubmit={handleSubmit}
            enableReinitialize 
          >
            {({ isSubmitting }) => (
              <FormikForm>
                {/* Section for "Recently Added" */}
                <div className="mb-4 p-3 border rounded">
                  <h5>Recently Added</h5>
                  {/* Display existing images */}
                  <div>
                    {initialSettings.homepageBackgrounds?.recentlyAdded?.map((img, i) => (
                      <ImagePreview key={`existing-recent-${i}`} src={img} onDelete={() => handleDeleteExistingImage('recentlyAdded', img)} />
                    ))}
                  </div>
                  {/* Display newly staged images for preview */}
                  {newFiles.recentlyAddedImages.length > 0 && 
                    <div style={{borderTop: '1px dashed #ccc', marginTop: '10px', paddingTop: '10px'}}>
                      <h6>New images to be uploaded:</h6>
                      {newFiles.recentlyAddedImages.map((file, i) => (
                         <ImagePreview key={`new-recent-${i}`} src={file} onDelete={() => handleDeleteNewImage('recentlyAddedImages', file)} />
                      ))}
                    </div>
                  }
                  <label className="form-label mt-2">Upload New Images:</label>
                  <input id="recentlyAddedInput" type="file" multiple className="form-control" onChange={(e) => handleFileChange(e, 'recentlyAddedImages')} />
                </div>
                
                {/* Section for "Wildlife Safari" */}
                <div className="mb-4 p-3 border rounded">
                  <h5>Wildlife Safari</h5>
                  <div>
                    {initialSettings.homepageBackgrounds?.wildlifeSafari?.map((img, i) => (
                      <ImagePreview key={`existing-safari-${i}`} src={img} onDelete={() => handleDeleteExistingImage('wildlifeSafari', img)} />
                    ))}
                  </div>
                  {newFiles.wildlifeSafariImages.length > 0 &&
                    <div style={{borderTop: '1px dashed #ccc', marginTop: '10px', paddingTop: '10px'}}>
                      <h6>New images to be uploaded:</h6>
                      {newFiles.wildlifeSafariImages.map((file, i) => (
                         <ImagePreview key={`new-safari-${i}`} src={file} onDelete={() => handleDeleteNewImage('wildlifeSafariImages', file)} />
                      ))}
                    </div>
                  }
                  <label className="form-label mt-2">Upload New Images:</label>
                  <input id="wildlifeSafariInput" type="file" multiple className="form-control" onChange={(e) => handleFileChange(e, 'wildlifeSafariImages')} />
                </div>

                {/* Section for "Safari Photos" */}
                <div className="mb-4 p-3 border rounded">
                  <h5>Safari Photos</h5>
                  <div>
                    {initialSettings.homepageBackgrounds?.safariPhotos?.map((img, i) => (
                      <ImagePreview key={`existing-photos-${i}`} src={img} onDelete={() => handleDeleteExistingImage('safariPhotos', img)} />
                    ))}
                  </div>
                  {newFiles.safariPhotosImages.length > 0 &&
                    <div style={{borderTop: '1px dashed #ccc', marginTop: '10px', paddingTop: '10px'}}>
                      <h6>New images to be uploaded:</h6>
                      {newFiles.safariPhotosImages.map((file, i) => (
                         <ImagePreview key={`new-photos-${i}`} src={file} onDelete={() => handleDeleteNewImage('safariPhotosImages', file)} />
                      ))}
                    </div>
                  }
                  <label className="form-label mt-2">Upload New Images:</label>
                  <input id="safariPhotosInput" type="file" multiple className="form-control" onChange={(e) => handleFileChange(e, 'safariPhotosImages')} />
                </div>

                <div className="text-center mt-4">
                  <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
                    {isSubmitting ? 'Saving...' : 'Save All Changes'}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HomeMedia;