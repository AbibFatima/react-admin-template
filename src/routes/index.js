import React from 'react';
import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';

import NotFound from 'pages/extra-pages/NotFound';
import MinimalLayout from 'layout/MinimalLayout';
import AdminRoute from './Spinner/AdminRoute';
import MainLayout from 'layout/MainLayout';
import Spinner from './Spinner/Spinner';
import MainRoute from './Spinner/MainRoute';

const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));

// render - dashboard pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Prediction = Loadable(lazy(() => import('pages/dashboard-details/prediction')));
const Uplift = Loadable(lazy(() => import('pages/dashboard-details/uplift')));
const Segments = Loadable(lazy(() => import('pages/dashboard-details/Segments')));

// render - admin pages
const AdminDashboard = Loadable(lazy(() => import('pages/administrator')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const routes = [
    {
      children: [
        {
          path: '/',
          element: <MinimalLayout />,
          children: [
            {
              path: '/',
              element: <AuthLogin />
            },
            {
              path: 'login',
              element: <AuthLogin />
            }
          ]
        }
      ]
    },
    {
      element: <MainRoute />,
      children: [
        {
          path: '/',
          element: <MainLayout />,
          children: [
            {
              path: 'dashboard',
              children: [
                {
                  path: 'default',
                  element: (
                    <Suspense fallback={<Spinner />}>
                      <DashboardDefault />
                    </Suspense>
                  )
                }
              ]
            },
            {
              path: 'prediction',
              element: (
                <Suspense fallback={<Spinner />}>
                  <Prediction />
                </Suspense>
              )
            },
            {
              path: 'uplift',
              element: (
                <Suspense fallback={<Spinner />}>
                  <Uplift />
                </Suspense>
              )
            },
            {
              path: 'segments',
              element: (
                <Suspense fallback={<Spinner />}>
                  <Segments />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      element: <AdminRoute />,
      children: [
        {
          path: '/',
          element: <MainLayout />,
          children: [
            {
              path: 'admin/dashboard',
              element: (
                <Suspense fallback={<Spinner />}>
                  <AdminDashboard />
                </Suspense>
              )
            },
            {
              path: 'admin/register',
              element: (
                <Suspense fallback={<Spinner />}>
                  <AuthRegister />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      element: <AdminRoute />,
      children: [
        {
          path: 'admin',
          element: <MinimalLayout />,
          children: [
            { path: 'dashboard', element: <AdminDashboard /> },
            { path: 'register', element: <AuthRegister /> }
          ]
        }
      ]
    },
    { path: '*', element: <NotFound /> }
  ];

  return useRoutes(routes);
}
