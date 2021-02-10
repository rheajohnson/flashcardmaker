import React, { useState } from "react";
import { PageHeader, Button } from "antd";
import { Layout, List } from "antd";
import FCSetsCard from "../components/fc-sets-card";
import FCSetsModal from "../components/fc-sets-modal";

const { Content } = Layout;

const data = [
  {
    title: "In dui magna posuere eget In dui magna posuere eget",
    id: 1,
    description:
      "Nulla sit amet est. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus.",
    count: 32,
  },
  {
    title: "Vocab 2",
    id: 2,
    description: "boop",
    count: 24,
  },
  {
    title: "Vocab 3",
    id: 3,
    description: "boop",
    count: 16,
  },
];

const FCSets = () => {
  const [modalEditVisible, setModalEditVisible] = useState(false);

  const [modalEditAction, setModalEditAction] = useState(null);

  const onModalEditOpen = (action) => {
    setModalEditAction(action);
    setModalEditVisible(true);
  };

  return (
    <Layout className="content-layout">
      <FCSetsModal
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        action={modalEditAction}
      />
      <PageHeader
        title="Flash Card Sets"
        className="content-page-header"
        extra={[
          <Button key="1" type="primary" onClick={() => onModalEditOpen("add")}>
            New Set
          </Button>,
        ]}
      />
      <Content className="content">
        <div className="site-card-wrapper">
          <List
            grid={{
              gutter: 16,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <FCSetsCard item={item} onCardModalOpen={onModalEditOpen} />
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default FCSets;
