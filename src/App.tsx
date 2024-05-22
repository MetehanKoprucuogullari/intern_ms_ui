import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import EditPlanPage from "./pages/Mentor/EditPlanPage";
import InternsPage from "./pages/Mentor/InternsPage";
import InternDetailPage from "./pages/Mentor/InternDetailPage";
import HeaderMenu from "./components/Mentor/HeaderMenu";
import HeaderMenuHR from "./components/Hr/HeaderMenuHR";
import HeaderMenuIntern from "./components/Intern/HeaderMenuIntern";
import { InternshipApplications } from "./pages/Hr/InternshipApplications";
import HomePage from "./pages/User/HomePage";
import InternsPageHR from "./pages/Hr/InternsPageHR";
import Attendance from "./pages/Intern/Attendance";
import Works from "./pages/Intern/Works";
import CreateUser from "./pages/Hr/CreateUser";
import AttendanceEdit from "./pages/Hr/AttendanceEdit";
import EditInfos from "./pages/Hr/EditInfos";
import EditInternInfos from "./pages/Intern/EditInternInfos";
import { EditDocs } from "./pages/Intern/EditDocs";

const { Content,  Footer, Sider } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/*"
          element={
            <Layout style={{ minHeight: "100vh" }}>
              <Sider>
                <HeaderMenu />
              </Sider>
              <Layout>
                <Content>
                  <Routes>
                    <Route path="/interns" element={<InternsPage />} />
                    <Route path="/edit" element={<EditPlanPage />} />
                    <Route path="/internDetail" element={<InternDetailPage />} />
                    <Route path="/infos" element={<EditInfos />} />
                  </Routes>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                  Ant Design ©2023 Created by Ant UED
                </Footer>
              </Layout>
            </Layout>
          }
        />
        <Route
          path="/hr/*"
          element={
            <Layout style={{ minHeight: "100vh" }} className="overflow-hidden">
              <Sider className="fixed z-50">
                <HeaderMenuHR />
              </Sider>
              <Layout>
                <Content>
                  <Routes>
                    <Route path="/applications" element={<InternshipApplications />} />
                    <Route path="/interns" element={<InternsPageHR />} />
                    <Route path="/user" element={<CreateUser />} />
                    <Route path="/internDetail" element={<AttendanceEdit />} />
                    <Route path="/infos" element={<EditInfos />} />
                  </Routes>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                  Ant Design ©2023 Created by Ant UED
                </Footer>
              </Layout>
            </Layout>   
          }
        />
        <Route
          path="/intern/*"
          element={
            <Layout style={{ minHeight: "100vh",}} className="overflow-hidden">
              <Sider className="fixed z-50">
                <HeaderMenuIntern />
              </Sider>
              <Layout>
                <Content>
                  <Routes>
                    <Route path="/docs" element={<EditDocs />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/works" element={<Works />} />
                    <Route path="/infos" element={<EditInternInfos />} />
                  </Routes>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                  Ant Design ©2023 Created by Ant UED
                </Footer>
              </Layout>
            </Layout>   
          }
        />
      </Routes>
    </Router>
  );
};

export default App;