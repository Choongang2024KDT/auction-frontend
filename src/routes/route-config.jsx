import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootLayout from "../components/layout/RootLayout.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import Home from "../pages/Home.jsx"
import SignUpPage from '../pages/SignUpPage.jsx';
import LoginPage from "../pages/LoginPage.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import UserPage from "../pages/UserPage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            // 중첩된 라우트를 추가하여 Outlet에 렌더링될 페이지들 설정
            {
                index: true,  // / 경로에 대해 기본 페이지 (Home 컴포넌트)
                element: <Home/>
            },
            {
                path: 'sign-up',
                element: <SignUpPage/>
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'user',
                element: <PrivateRoute />,
                children: [
                    {
                        index: true,
                        element: <UserPage />, //로그인해야 볼 수 있는 페이지
                    }
                ]
            }
        ],
    }
]);
export default router;