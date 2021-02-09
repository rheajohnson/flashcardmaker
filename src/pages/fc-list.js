import React from "react";
import { List } from "antd";
import { PageHeader, Button } from "antd";
import { Layout } from "antd";
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

const FCList = () => {
  return (
    <div className="content-container">
      <PageHeader
        title="Vocab 1"
        className="content-page-header"
        extra={[
          <Button key="2" type="Secondary">
            New Flash Card
          </Button>,
          <Button key="1" type="primary">
            Study
          </Button>,
        ]}
      >
        <Content className="content">
          <List
            itemLayout="horizontal"
            dataSource={data}
            className="list"
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">edit</a>,
                  <a key="list-loadmore-more">delete</a>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Content>
      </PageHeader>
    </div>
  );
};

export default FCList;
