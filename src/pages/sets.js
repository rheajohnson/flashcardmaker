import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout } from "antd";
import SetsContent from "../components/sets-content";
import SetsModal from "../components/sets-modal";
import { getUserSets, getPublicSets, setSet } from "../redux/actions/sets";
import Loading from "../components/loading";

const Sets = () => {
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSetsFiltered, setuserSetsFiltered] = useState(null);
  const [publicSetsFiltered, setPublicSetsFiltered] = useState(null);
  const { userSets, publicSets } = useSelector((state) => state.sets);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(async () => {
    if (user && user.sets && user.sets.length) {
      await dispatch(getUserSets()).then(() => dispatch(getPublicSets()));
      setLoading(false);
    } else if (user) {
      dispatch(getPublicSets()).then(() => setLoading(false));
    }
  }, [user]);

  const prevUserSetsRef = useRef();
  useEffect(() => {
    if (userSets) {
      const prevUserSets = prevUserSetsRef.current;
      if (userSets && prevUserSets !== userSets) {
        const dataSorted = sortSet(userSets);
        setuserSetsFiltered(dataSorted);
      }
      prevUserSetsRef.current = userSets;
    }
  }, [userSets]);

  const prevPublicSetsRef = useRef();
  useEffect(() => {
    if (publicSets) {
      const prevUserSets = prevUserSetsRef.current;
      if (publicSets && prevUserSets !== publicSets) {
        const dataSorted = sortSet(publicSets);
        setPublicSetsFiltered(dataSorted);
      }
      prevPublicSetsRef.current = userSets;
    }
  }, [publicSets]);

  const sortSet = (data) => {
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

  if (loading) return <Loading />;

  return (
    <Layout className="content-layout">
      <SetsModal
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        action={modalEditAction}
      />
      {user && userSetsFiltered && (
        <SetsContent
          type="private"
          sets={userSetsFiltered}
          editable
          onModalEditOpen={onModalEditOpen}
        />
      )}
      <SetsContent type="public" sets={publicSetsFiltered} editable={false} />
    </Layout>
  );
};

export default Sets;
