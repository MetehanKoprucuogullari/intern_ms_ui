import { App } from "antd";
const routesConfig = [
    {
      path: "/",
      element: (
        <>
          <App />
        </>
      ),
      children: [
        { path: "/", element: <App/> },
      ],
    },
  ];
  
  export default routesConfig;