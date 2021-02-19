import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Input, PageHeader, Button, List } from "antd";
import FlashcardListModal from "../components/flashcard-list-modal";
import DeleteConfirm from "../components/delete-confirm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Loading from "../components/loading";

import {
  getAllFlashcards,
  setFlashcard,
  clearAllFlashcards,
  deleteFlashcard,
} from "../redux/actions/flashcards";
import { setSet, getUserSets } from "../redux/actions/sets";

const { Content } = Layout;

const FlashcardList = ({ match }) => {
  const dispatch = useDispatch();
  const { allFlashcards } = useSelector((state) => state.flashcards);
  const { selectedSet, allSets } = useSelector((state) => state.sets);
  const [loading, setLoading] = useState(true);
  const [dataFiltered, setDataFiltered] = useState([]);
  const history = useHistory();

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);

  const sortData = (data) => {
    return data.sort(function (a, b) {
      if (a.front.toLowerCase() < b.front.toLowerCase()) {
        return -1;
      }
      if (a.front.toLowerCase() > b.front.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    dispatch(clearAllFlashcards());
  }, []);

  useEffect(() => {
    const id = match.params.id;
    if (!allSets.length) {
      dispatch(getUserSets());
    }
    if (allSets.length) {
      dispatch(getAllFlashcards(id)).then(() => setLoading(false));
    }
    const set = allSets.find((set) => set.id === id) || {};
    dispatch(setSet(set));
  }, [allSets]);

  const prevFlashcardsRef = useRef();

  useEffect(() => {
    const dataSorted = sortData(allFlashcards);
    setDataFiltered(dataSorted);
    const prevSets = prevFlashcardsRef.current;
    if (prevSets !== allFlashcards) {
      const dataSorted = sortData(allFlashcards);
      setDataFiltered(dataSorted);
    }
    prevFlashcardsRef.current = allFlashcards;
  }, [allFlashcards]);

  const onModalEditOpen = (action, id) => {
    if (id) {
      const flashcard = allFlashcards.find((flashcard) => flashcard.id === id);
      dispatch(setFlashcard(flashcard));
    }
    setModalEditAction(action);
    setModalEditVisible(true);
  };

  const pageHeaderTitle = () => {
    return (
      <>
        <Link to={"/"}>Flashcard sets</Link>
        {" > "}
        {selectedSet.name}
      </>
    );
  };

  const handleDelete = async (id) => {
    return dispatch(deleteFlashcard(selectedSet.id, id)).then(() =>
      dispatch(getUserSets(false))
    );
  };

  const onSearch = (e) => {
    const val = e.target.value;
    setDataFiltered(
      allFlashcards.filter((card) => {
        if (
          card.front.toLowerCase().includes(val.toLowerCase()) ||
          card.back.toLowerCase().includes(val.toLowerCase())
        ) {
          return card;
        }
      })
    );
  };

  return (
    <Layout className="content-layout">
      <FlashcardListModal
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
          <Button
            key="1"
            type="primary"
            onClick={() => history.push(`/set/${selectedSet.id}/study`)}
            disabled={!allFlashcards.length}
          >
            Study
          </Button>,
        ]}
      />
      <Content className="content">
        {loading ? (
          <Loading />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={dataFiltered}
            className="list"
            locale={{ emptyText: "No flashcards. Try adding one!" }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <EditOutlined
                    onClick={() => onModalEditOpen("edit", item.id)}
                    key={item.id}
                  />,
                  <DeleteOutlined
                    onClick={() => DeleteConfirm(item.id, handleDelete)}
                    key={item.id}
                  />,
                ]}
              >
                <List.Item.Meta title={item.front} description={item.back} />
              </List.Item>
            )}
          />
        )}
      </Content>
    </Layout>
  );
};

export default FlashcardList;
