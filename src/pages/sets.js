import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PageHeader, Button, Layout, List, Breadcrumb } from "antd";
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
  const { userSets, publicSets } = useSelector((state) => state.sets);
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getPublicSets());
  }, []);

  useEffect(() => {
    if (user && !userSets) {
      dispatch(getUserSets());
    }
  }, [user]);

  useEffect(() => {
    const publicSetsLoaded = publicSets && publicSets.length;
    if (isLoggedIn ? userSets && publicSetsLoaded : publicSetsLoaded)
      setLoading(false);
  }, [userSets, publicSets]);

  const prevUserSetsRef = useRef();

  useEffect(() => {
    const prevUserSets = prevUserSetsRef.current;
    if (userSets && prevUserSets !== userSets) {
      const dataSorted = sortData(userSets);
      setSetsFiltered(dataSorted);
    }
    prevUserSetsRef.current = userSets;
  }, [userSets]);

  const prevPublicSetsRef = useRef();

  useEffect(() => {
    const prevUserSets = prevUserSetsRef.current;
    if (publicSets && prevUserSets !== publicSets) {
      const dataSorted = sortData(publicSets);
      setPublicSetsFiltered(dataSorted);
    }
    prevPublicSetsRef.current = userSets;
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
    dispatch(setSet(id)).then(() => setModalEditVisible(true));
    setModalEditAction(action);
  };

  const renderSets = (type, sets, renderAction) => {
    const action = {};
    if (renderAction) {
      action.extra = [
        <Button key="1" type="primary" onClick={() => onModalEditOpen("add")}>
          New set
        </Button>,
      ];
    }

    if (loading) return <Loading />;

    return (
      <>
        <PageHeader
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                {type === "public" ? "Public sets" : "My sets"}
              </Breadcrumb.Item>
            </Breadcrumb>
          }
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
                    editable={
                      type === "private" || (user && user.userRole === "admin")
                    }
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
      {isLoggedIn && renderSets("private", setsFiltered, true)}
      {renderSets("public", publicSetsFiltered, false)}
    </Layout>
  );
};

export default Sets;
