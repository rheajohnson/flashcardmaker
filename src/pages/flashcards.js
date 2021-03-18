import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setSet, getSets } from "../redux/actions/sets";

import FlashcardsModal from "../components/flashcards-modal";
import DeleteConfirm from "../components/delete-confirm";
import Loading from "../components/loading";
import { sortFlashcardList } from "../helper/sort";

import { Layout, Input, PageHeader, Button, List, Breadcrumb } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllFlashcards,
  setFlashcard,
  deleteFlashcard,
} from "../redux/actions/flashcards";
const { Content } = Layout;

const FlashcardList = ({ match }) => {
  const dispatch = useDispatch();
  const { allFlashcards } = useSelector((state) => state.flashcards);
  const { selectedSet } = useSelector((state) => state.sets);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dataSorted, setDataSorted] = useState([]);
  const history = useHistory();

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);

  const editable =
    (user && user.sets && user.sets.includes(selectedSet.id)) ||
    (user && user.userRole && user.userRole === "admin");

  useEffect(async () => {
    const id = match.params.id;
    dispatch(setSet(id)).catch(() => history.push("/"));
    dispatch(getAllFlashcards(id)).then(() => setLoading(false));
  }, []);

  const prevFlashcardsRef = useRef();
  useEffect(() => {
    if (allFlashcards) {
      const prevFlashcards = prevFlashcardsRef.current;
      if (prevFlashcards !== allFlashcards) {
        const dataSorted = sortFlashcardList(allFlashcards);
        setDataSorted(dataSorted);
      }
      prevFlashcardsRef.current = allFlashcards;
    }
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
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={"/"}>Flashcard sets</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{selectedSet.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  const handleDelete = async (id) => {
    await dispatch(deleteFlashcard(selectedSet.id, id)).then(() =>
      dispatch(getSets())
    );
  };

  const onSearch = (e) => {
    const val = e.target.value;
    setDataSorted(
      allFlashcards.filter(
        (card) =>
          card.term.toLowerCase().includes(val.toLowerCase()) ||
          card.definition.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  if (!selectedSet) return <Loading />;

  const renderActions = () => {
    const action = [
      <Input
        placeholder="Search..."
        onInput={(e) => {
          onSearch(e);
        }}
        style={{ width: 200 }}
        key="3"
      />,
      <Button
        key="1"
        type="primary"
        onClick={() => history.push(`/${selectedSet.id}/study`)}
        disabled={!allFlashcards || !allFlashcards.length}
      >
        Study
      </Button>,
    ];
    if (editable) {
      action.splice(
        1,
        0,
        <Button key="2" type="Secondary" onClick={() => onModalEditOpen("add")}>
          New card
        </Button>
      );
    }
    return action;
  };

  return (
    <>
      <PageHeader
        title={pageHeaderTitle()}
        className="content-header"
        extra={renderActions()}
      />
      <Content className="content">
        {loading ? (
          <Loading />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={dataSorted}
            className="list"
            locale={{ emptyText: "No flashcards." }}
            renderItem={(item) => (
              <List.Item
                actions={
                  editable && [
                    <EditOutlined
                      onClick={() => onModalEditOpen("edit", item.id)}
                      key={item.id}
                    />,
                    <DeleteOutlined
                      onClick={() => DeleteConfirm(item.id, handleDelete)}
                      key={item.id}
                    />,
                  ]
                }
              >
                <List.Item.Meta
                  title={item.term}
                  description={item.definition}
                />
              </List.Item>
            )}
          />
        )}
      </Content>
      <FlashcardsModal
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        action={modalEditAction}
      />
    </>
  );
};

export default FlashcardList;
