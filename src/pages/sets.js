import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PageHeader, Button, Layout, List } from "antd";
import SetsCard from "../components/sets-card";
import SetsModal from "../components/sets-modal";
import { getUserSets, getPublicSets, setSet } from "../redux/actions/sets";
import Loading from "../components/loading";

const { Content } = Layout;

const Sets = () => {
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setsFiltered, setSetsFiltered] = useState([]);
  const [publicSetsFiltered, setPublicSetsFiltered] = useState([]);
  const { allSets, publicSets } = useSelector((state) => state.sets);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getUserSets());
    dispatch(getPublicSets()).then(() => setLoading(false));
  }, []);

  const prevSetsRef = useRef();

  useEffect(() => {
    const prevSets = prevSetsRef.current;
    if (prevSets !== allSets) {
      const dataSorted = sortData(allSets);
      setSetsFiltered(dataSorted);
    }
    prevSetsRef.current = allSets;
  }, [allSets]);

  const prevPublicSetsRef = useRef();

  useEffect(() => {
    const prevSets = prevSetsRef.current;
    if (prevSets !== publicSets) {
      const dataSorted = sortData(publicSets);
      setPublicSetsFiltered(dataSorted);
    }
    prevPublicSetsRef.current = allSets;
  }, [publicSets]);

  const sortData = (data) => {
    return data.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  };

  const onModalEditOpen = (action, id) => {
    if (id) {
      const set = allSets.find((set) => set.id === id);
      dispatch(setSet(set));
    }
    setModalEditAction(action);
    setModalEditVisible(true);
  };

  const renderSets = (header, sets, renderAction) => {
    const action = {};
    if (renderAction) {
      action.extra = [
        <Button key="1" type="primary" onClick={() => onModalEditOpen("add")}>
          New set
        </Button>,
      ];
    }
    return (
      <>
        <PageHeader
          title={header}
          className="content-page-header"
          {...action}
        />
        <Content className="content">
          <div className="site-card-wrapper">
            <List
              grid={{
                gutter: 16,
              }}
              locale={{ emptyText: "No flashcard sets" }}
              dataSource={sets}
              renderItem={(item) => (
                <List.Item>
                  <SetsCard
                    item={item}
                    onCardModalOpen={() => onModalEditOpen("edit", item.id)}
                  />
                </List.Item>
              )}
            />
          </div>
        </Content>
      </>
    );
  };

  return (
    <Layout className="content-layout">
      <SetsModal
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        action={modalEditAction}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          {isLoggedIn && renderSets("My sets", setsFiltered, true)}
          {renderSets("Public sets", publicSetsFiltered, false)}
        </>
      )}
    </Layout>
  );
};

export default Sets;
