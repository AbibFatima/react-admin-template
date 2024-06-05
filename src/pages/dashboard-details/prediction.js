import { useEffect, useState } from 'react';
// material-ui
import { Alert, Autocomplete, Box, Button, Divider, FormHelperText, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import { Formik } from 'formik';
import * as Yup from 'yup';

import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// ===============================|| COMPONENT - FORM PREDICTION ||=============================== //
const Prediction = () => {
  const [clientOptions, setClientOptions] = useState([]);
  const [phoneOptions, setPhoneOptions] = useState([]);
  const [, setSelectedClient] = useState('');

  useEffect(() => {
    // Fetch the options for the autocomplete
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/client-data');
        const data = await response.json();

        setClientOptions(data.map((client) => ({ label: client.id_client.toString(), value: client.id_client })));
      } catch (error) {
        console.error('Failed to fetch client IDs:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleClientIdChange = async (event, value) => {
    setSelectedClient(value?.value || '');
    try {
      const response = await fetch(`http://localhost:5000/client-phone/${value?.value}`);
      const data = await response.json();
      setPhoneOptions(data.map((client) => ({ label: client.phone_number.toString(), value: client.phone_number })));
    } catch (error) {
      console.error('Failed to fetch client phone number:', error);
    }
  };

  return (
    <ComponentSkeleton>
      <MainCard>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack justifyContent="center" alignItems="center">
              <Typography variant="h3">Form Customer Prediction</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <MainCard>
              <Formik
                initialValues={{
                  idClient: '',
                  phonenumber: '',
                  submit: null
                }}
                validationSchema={Yup.object().shape({
                  idClient: Yup.string().max(6).required('ID Client is required'),
                  phonenumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                  try {
                    const response = await fetch('//localhost:5000/prediction', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(values)
                    });
                    const data = await response.json();
                    if (response.ok) {
                      setStatus({
                        success: true,
                        message: 'Prediction successful!',
                        prediction: data.prediction[0],
                        probability: data.probability
                      });
                      setSubmitting(false);
                    } else {
                      const errorMessage = data.error || 'Something went wrong';
                      setErrors({ submit: errorMessage });
                      setSubmitting(false);
                    }
                  } catch (error) {
                    console.log('Error:', error);
                    setErrors({ submit: error.message });
                    setStatus({ success: false });
                    setSubmitting(false);
                  }
                }}
              >
                {({ errors, status, handleBlur, isSubmitting, handleSubmit, touched, values, setFieldValue }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="idClient-prediction">ID Customer</InputLabel>
                          <Autocomplete
                            id="id-client"
                            options={clientOptions}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, value) => {
                              setFieldValue('idClient', value?.value || '');
                              handleClientIdChange(event, value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="idClient"
                                onBlur={handleBlur}
                                placeholder="ID"
                                fullWidth
                                error={Boolean(touched.idClient && errors.idClient)}
                                helperText={touched.idClient && errors.idClient}
                              />
                            )}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="phonenumber-prediction">Phone Number</InputLabel>
                          <Autocomplete
                            id="phonenumber"
                            options={phoneOptions}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, value) => setFieldValue('phonenumber', value?.value || '')}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="phonenumber"
                                onBlur={handleBlur}
                                placeholder="Phone Number"
                                fullWidth
                                error={Boolean(touched.phonenumber && errors.phonenumber)}
                                helperText={touched.phonenumber && errors.phonenumber}
                              />
                            )}
                          />
                        </Stack>
                      </Grid>

                      {errors.submit && (
                        <Grid item xs={12}>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <AnimateButton>
                          <Button
                            disableElevation
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            Predict
                          </Button>
                        </AnimateButton>
                      </Grid>
                      {status && status.message && (
                        <Grid item xs={12}>
                          <Alert severity="success">{status.message}</Alert>
                          <Divider />
                          {status.prediction === 1 ? (
                            <Grid container spacing={2} justifyContent="center">
                              <Box mt={3} display="flex" justifyContent="space-around" flexWrap="wrap">
                                <Box mt={12}>
                                  <Stack spacing={1} justifyContent="center" alignItems="center">
                                    <Typography variant="h2">The Client {values.idClient} is predicted to churn</Typography>
                                  </Stack>
                                </Box>
                                <Box mt={2}>
                                  <ReactApexChart
                                    options={{
                                      chart: {
                                        type: 'radialBar'
                                      },
                                      plotOptions: {
                                        radialBar: {
                                          startAngle: 0,
                                          endAngle: 360,
                                          hollow: {
                                            margin: 0,
                                            size: '70%',
                                            background: '#fff',
                                            image: undefined,
                                            imageOffsetX: 0,
                                            imageOffsetY: 0,
                                            position: 'front',
                                            dropShadow: {
                                              enabled: true,
                                              top: 3,
                                              left: 0,
                                              blur: 4,
                                              opacity: 0.24
                                            }
                                          },
                                          track: {
                                            background: '#fff',
                                            strokeWidth: '67%',
                                            margin: 0,
                                            dropShadow: {
                                              enabled: true,
                                              top: -3,
                                              left: 0,
                                              blur: 4,
                                              opacity: 0.35
                                            }
                                          },
                                          dataLabels: {
                                            show: true,
                                            name: {
                                              offsetY: -10,
                                              show: true,
                                              color: '#888',
                                              fontSize: '15px'
                                            },
                                            value: {
                                              formatter: function (val) {
                                                return parseInt(val) + '%';
                                              },
                                              color: '#111',
                                              fontSize: '32px',
                                              show: true
                                            }
                                          }
                                        }
                                      },
                                      fill: {
                                        type: 'gradient',
                                        gradient: {
                                          shade: 'dark',
                                          type: 'horizontal',
                                          shadeIntensity: 0.5,
                                          gradientToColors: ['#ABE5A1'],
                                          inverseColors: true,
                                          opacityFrom: 1,
                                          opacityTo: 1,
                                          stops: [0, 100]
                                        }
                                      },
                                      stroke: {
                                        lineCap: 'round'
                                      },
                                      labels: ['Churn Probability']
                                    }}
                                    series={[status.probability]}
                                    type="radialBar"
                                    height={280}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          ) : (
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                <Box mt={2}>
                                  <Typography variant="body1">The Client with the ID {values.idClient} isn t predicted to churn</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </form>
                )}
              </Formik>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </ComponentSkeleton>
  );
};

export default Prediction;
