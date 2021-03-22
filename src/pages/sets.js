import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSets, setSet } from "../redux/actions/sets";
import { sortSet } from "../helper/sort";
import SetsContent from "../components/sets-content";
import SetsModal from "../components/sets-modal";
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

  useEffect(() => {
    if (user) {
      dispatch(getSets()).then(() => setLoading(false));
    }
  }, [user]);

  const onModalOpen = (action, id) => {
    setModalEditAction(action);
    if (id)
      dispatch(setSet(id)).then(() => {
        setModalEditVisible(true);
      });
    else setModalEditVisible(true);
  };

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
      const prevUserSets = prevPublicSetsRef.current;
      if (publicSets && prevUserSets !== publicSets) {
        const dataSorted = sortSet(publicSets);
        setPublicSetsFiltered(dataSorted);
      }
      prevPublicSetsRef.current = userSets;
    }
  }, [publicSets]);

  if (loading) return <Loading />;

  return (
    <>
      {user && userSetsFiltered && (
        <SetsContent
          type="private"
          sets={userSetsFiltered}
          onModalOpen={onModalOpen}
        />
      )}
      <SetsContent type="public" sets={publicSetsFiltered} />
      <SetsModal
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        action={modalEditAction}
      />
    </>
  );
};

export default Sets;
