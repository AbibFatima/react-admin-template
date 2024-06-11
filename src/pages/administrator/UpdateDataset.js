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
            setUploadStatus({ type: 'success', message: `${file.name} fichier chargé avec succès.` });
          } else {
            setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, status: 'error' } : item)));
            setUploadStatus({ type: 'error', message: `${file.name} le chargement du fichier a échoué.` });
          }
        } else {
          setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, status: 'error' } : item)));
          setUploadStatus({ type: 'error', message: `${file.name} le chargement du fichier a échoué.` });
        }
      };

      xhr.onerror = () => {
        setFileList((prevList) => prevList.map((item) => (item.uid === uid ? { ...item, status: 'error' } : item)));
        setUploadStatus({ type: 'error', message: `${file.name} le chargement du fichier a échoué.` });
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
                {isDragActive
                  ? 'Déposer les fichiers ici ...'
                  : 'Cliquer ou faire glisser un fichier CSV dans cette zone pour le télécharger'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Prise en charge d&apos;un chargement unique. Il est strictement interdit de charger des données ne provenant pas de
                l&apos;entreprise ou d&apos;autres fichiers interdits.
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
                      Chargé
                    </Typography>
                  )}
                  {file.status === 'error' && (
                    <Typography variant="body2" color="error.main">
                      Échec du chargement
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
