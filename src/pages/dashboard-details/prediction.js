// material-ui
import { Alert, Box, Button, Divider, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import { Formik } from 'formik';
import * as Yup from 'yup';

import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

// ===============================|| COMPONENT - FORM PREDICTION ||=============================== //
const Prediction = () => (
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
                idClient: '123456',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                idClient: Yup.string().max(6).required('ID Client is required')
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
              {({ errors, status, handleBlur, handleChange, isSubmitting, handleSubmit, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="idClient-prediction">ID Customer</InputLabel>
                        <OutlinedInput
                          id="id-client"
                          type="idClient"
                          value={values.idClient}
                          name="idClient"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ID"
                          fullWidth
                          error={Boolean(touched.idClient && errors.idClient)}
                        />
                        {touched.idClient && errors.idClient && (
                          <FormHelperText error id="standard-weight-helper-text-email-login">
                            {errors.idClient}
                          </FormHelperText>
                        )}
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
                                        startAngle: -135,
                                        endAngle: 225,
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
                                            fontSize: '17px'
                                          },
                                          value: {
                                            formatter: function (val) {
                                              return parseInt(val);
                                            },
                                            color: '#111',
                                            fontSize: '36px',
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
                                  height={250}
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

export default Prediction;
