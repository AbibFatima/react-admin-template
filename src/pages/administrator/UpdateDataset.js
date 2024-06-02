import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import { Grid, Typography, Box, Alert, LinearProgress, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

// ===============================|| COMPONENT - UPDATEDATESET ||=============================== //

const DropzoneContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

export default function UpdateDataset() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileList, setFileList] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const uid = new Date().getTime().toString();
      const newFile = {
        uid,
        name: file.name,
        status: 'uploading',
        percent: 0
      };
      setFileList((prevList) => [...prevList, newFile]);

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '//localhost:5000/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, percent: percentComplete } : item)));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, status: 'done', percent: 100 } : item)));
            setUploadStatus({ type: 'success', message: `${file.name} file uploaded successfully.` });
          } else {
            setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, status: 'error' } : item)));
            setUploadStatus({ type: 'error', message: `${file.name} file upload failed.` });
          }
        } else {
          setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, status: 'error' } : item)));
          setUploadStatus({ type: 'error', message: `${file.name} file upload failed.` });
        }
      };

      xhr.onerror = () => {
        setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, status: 'error' } : item)));
        setUploadStatus({ type: 'error', message: `${file.name} file upload failed.` });
      };

      xhr.send(formData);
    });
  }, []);

  const handleRemove = (uid) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== uid));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.csv' });

  return (
    <ComponentSkeleton>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <MainCard>
            {uploadStatus && (
              <Alert severity={uploadStatus.type} sx={{ mb: 2 }}>
                {uploadStatus.message}
              </Alert>
            )}
            <DropzoneContainer {...getRootProps()}>
              <input {...getInputProps()} />
              <CloudUploadIcon fontSize="large" />
              <Typography variant="h6">
                {isDragActive ? 'Drop the files here ...' : 'Click or drag a CSV file to this area to upload'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
              </Typography>
            </DropzoneContainer>
          </MainCard>
        </Grid>
        {fileList.map((file) => (
          <Grid item xs={12} key={file.uid}>
            <MainCard>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {file.name}
                </Typography>
                <Box sx={{ width: '60%', mr: 2 }}>
                  {file.status === 'uploading' && <LinearProgress variant="determinate" value={file.percent} />}
                  {file.status === 'done' && (
                    <Typography variant="body2" color="success.main">
                      Uploaded
                    </Typography>
                  )}
                  {file.status === 'error' && (
                    <Typography variant="body2" color="error.main">
                      Upload failed
                    </Typography>
                  )}
                </Box>
                <IconButton onClick={() => handleRemove(file.uid)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </MainCard>
          </Grid>
        ))}
      </Grid>
    </ComponentSkeleton>
  );
}
