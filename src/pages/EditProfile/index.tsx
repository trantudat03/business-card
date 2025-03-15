import CardForm from "components/CardForm";
import { Welcome } from "pages/index/welcome";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header, Page } from "zmp-ui";

const EditProfile = () => {
  const navigate = useNavigate();
  return (
    <Page className=" relative flex-1 flex flex-col">
      {/* <Welcome /> */}
      <Header
        title="Thông tin danh thiếp"
        showBackIcon
        onBackClick={() => {
          navigate(-1);
        }}
      />
      <div className="overflow-y-auto ">
        <CardForm />
      </div>
    </Page>
  );
};

export default EditProfile;
