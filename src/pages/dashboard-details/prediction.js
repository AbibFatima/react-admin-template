// material-ui
import { Button, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import { Formik } from 'formik';
//import * as Yup from 'yup';

import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

// ===============================|| COMPONENT - FORM PREDCITION ||=============================== //
const Prediction = () => (
  <ComponentSkeleton>
    <MainCard container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h3">Form Custumer Prediction</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            <Formik>
              {({ handleBlur, handleChange, isSubmitting }) => (
                <form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="idClient-prediction">ID Custumer</InputLabel>
                        <OutlinedInput
                          id="id-client"
                          type="idClient"
                          //value={}
                          name="idClient"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ID"
                          fullWidth
                          //error={Boolean(touched.firstname && errors.firstname)}
                        />
                      </Stack>
                    </Grid>

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
