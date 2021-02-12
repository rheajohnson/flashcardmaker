import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Spin, Input, PageHeader, Button, List } from "antd";
import FCListModal from "../components/fc-list-modal";
import DeleteConfirm from "../components/delete-confirm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
];

const FCList = ({ name = data[0].title }) => {
  const [loading] = useState(false);
  const [dataFiltered, setDataFiltered] = useState(data);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);

  const onModalEditOpen = (action) => {
    setModalEditAction(action);
    setModalEditVisible(true);
  };

  const pageHeaderTitle = (name) => {
    return (
      <>
        <Link to={"/"}>Flashcard Sets</Link>
        {" > "}
        {name}
      </>
    );
  };

  const onSearch = (e) => {
    const val = e.target.value;
    setDataFiltered(
      data.filter((card) => {
        if (
          card.title.toLowerCase().includes(val.toLowerCase()) ||
          card.description.toLowerCase().includes(val.toLowerCase())
        ) {
          return card;
        }
      })
    );
  };

  return (
    <Layout className="content-layout">
      <FCListModal
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        action={modalEditAction}
      />
      <PageHeader
        title={pageHeaderTitle(name)}
        className="content-page-header"
        extra={[
          <Input
            placeholder="Search..."
            onInput={(e) => {
              onSearch(e);
            }}
            style={{ width: 200 }}
            key="3"
          />,
          <Button
            key="2"
            type="Secondary"
            onClick={() => onModalEditOpen("add")}
          >
            New Card
          </Button>,
          <Button key="1" type="primary">
            Study
          </Button>,
        ]}
      />
      <Content className="content">
        {loading ? (
          <div className="spin-container">
            <Spin />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={dataFiltered}
            className="list"
            renderItem={(item) => (
              <List.Item
                actions={[
                  <EditOutlined
                    onClick={() => onModalEditOpen("edit")}
                    key={item.id}
                  />,
                  <DeleteOutlined
                    onClick={() => DeleteConfirm(item.id)}
                    key={item.id}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        )}
      </Content>
    </Layout>
  );
};

export default FCList;
