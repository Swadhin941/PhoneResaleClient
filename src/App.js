import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./Components/Layout/Main";
import Home from "./Components/Home/Home/Home";
import "./App.css";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import AddProduct from "./Components/AddProduct/AddProduct";
import SellerRoute from "./Components/PrivateRoute/SellerRoute";
import ForbiddenAccessPage from "./Components/ForbiddenAccessPage/ForbiddenAccessPage";
import AllProduct from "./Components/AllProduct/AllProduct/AllProduct";
import DetailsPage from "./Components/DetailsPage/DetailsPage";
import Cart from "./Components/Cart/Cart";
import ErrorRoute from "./Components/ErrorRoute/ErrorRoute";
import WishList from "./Components/WishList/WishList";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import Orders from "./Components/Orders/Orders";
import MyProducts from "./Components/MyProducts/MyProducts";
import PaymentFail from "./Components/PaymentFail/PaymentFail";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorRoute></ErrorRoute>,
      element: <Main></Main>,
      children: [
        {
          path: "/",
          element: <Home></Home>
        },
        {
          path: "/register",
          element: <Register></Register>
        },
        {
          path: "/login",
          element: <Login></Login>
        },
        {
          path: "/cart",
          element: <PrivateRoute><Cart></Cart></PrivateRoute>
        },
        {
          path: "/forgetPassword",
          element: <ForgetPassword></ForgetPassword>
        },
        {
          path: "/addProduct",
          element: <SellerRoute><AddProduct></AddProduct></SellerRoute>
        },
        {
          path:"/selected-category/:brandName",
          element:<AllProduct></AllProduct>
        },
        {
          path:"/Details-page/:id",
          element: <DetailsPage></DetailsPage>
        },
        {
          path:"/wishList",
          element: <PrivateRoute><WishList></WishList></PrivateRoute>
        },
        {
          path:"/orders",
          element: <PrivateRoute><Orders></Orders></PrivateRoute>
        },
        {
          path: "/myProducts",
          element: <SellerRoute><MyProducts></MyProducts></SellerRoute>
        },
        {
          path:'/payment/fail',
          element: <PaymentFail></PaymentFail>
        }

      ]

    },
    {
      path:"*",
      element: <PageNotFound></PageNotFound>
    },
    {
      path: "/forbidden",
      element: <ForbiddenAccessPage></ForbiddenAccessPage>
    }
  ])
  return (
    <div className="marginBigScreen ">
      <RouterProvider router={router}>

      </RouterProvider>
      <Toaster />
    </div>
  );
}

export default App;
