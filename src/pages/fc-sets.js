import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PageHeader, Button } from "antd";
import { Layout, List } from "antd";
import FCSetsCard from "../components/fc-sets-card";
import FCSetsModal from "../components/fc-sets-modal";
import { getAllSets, setSet } from "../redux/actions/sets";

const { Content } = Layout;

const FCSets = () => {
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);
  const { allSets } = useSelector((state) => state.sets);
  const [setsFiltered, setSetsFiltered] = useState([]);

  const dispatch = useDispatch();

  const sortData = (data) => {
    return data.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(async () => {
    if (!allSets.length) {
      dispatch(getAllSets());
    }
  }, []);

  useEffect(() => {
    const dataSorted = sortData(allSets);
    setSetsFiltered(dataSorted);
  }, [allSets]);

  const onModalEditOpen = (action, id) => {
    if (id) {
      const set = allSets.find((set) => set.id === id);
      dispatch(setSet(set));
    }
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
        title="Flashcard Sets"
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
            dataSource={setsFiltered}
            renderItem={(item) => (
              <List.Item>
                <FCSetsCard
                  item={item}
                  onCardModalOpen={() => onModalEditOpen("edit", item.id)}
                />
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default FCSets;
