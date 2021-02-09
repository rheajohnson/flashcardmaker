import React, { useState } from "react";
import { PageHeader, Button } from "antd";
import { Layout, List } from "antd";
import FCSetsCard from "../components/fc-sets-card";
import FCSetsCardModal from "../components/fc-sets-card-modal";

const { Content } = Layout;

const data = [
  {
    title: "Vocab 1",
    id: 1,
    description: "beep",
  },
  {
    title: "Vocab 2",
    id: 2,
    description: "boop",
  },
  {
    title: "Vocab 3",
    id: 3,
    description: "boop",
  },
];

const FCSets = () => {
  const [cardModalEditVisible, setCardModalEditVisible] = useState(false);

  const [cardModalAction, setCardModalAction] = useState(null);

  const onCardModalOpen = (action) => {
    setCardModalAction(action);
    setCardModalEditVisible(true);
  };

  const onCardDelete = (id) => {
    console.log(`removing ${id}`);
  };

  return (
    <>
      <FCSetsCardModal
        visible={cardModalEditVisible}
        setVisible={setCardModalEditVisible}
        action={cardModalAction}
      />

      <div className="content-container">
        <PageHeader
          title="Flash Card Sets"
          className="content-page-header"
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => onCardModalOpen("add")}
            >
              New Set
            </Button>,
          ]}
        >
          <Content className="content">
            <div className="site-card-wrapper">
              <List
                grid={{
                  gutter: 16,
                }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <FCSetsCard
                      item={item}
                      onCardModalOpen={onCardModalOpen}
                      onCardDelete={onCardDelete}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Content>
        </PageHeader>
      </div>
    </>
  );
};

export default FCSets;
