import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Input, PageHeader, Button, List, Breadcrumb } from "antd";
import FlashcardListModal from "../components/flashcard-list-modal";
import DeleteConfirm from "../components/delete-confirm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Loading from "../components/loading";

import {
  getAllFlashcards,
  setFlashcard,
  deleteFlashcard,
} from "../redux/actions/flashcards";
import { setSet, getUserSets, getPublicSets } from "../redux/actions/sets";

const { Content } = Layout;

const FlashcardList = ({ match }) => {
  const dispatch = useDispatch();
  const { allFlashcards } = useSelector((state) => state.flashcards);
  const { selectedSet } = useSelector((state) => state.sets);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dataFiltered, setDataFiltered] = useState([]);
  const history = useHistory();

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);

  const sortData = (data) => {
    return data.sort(function (a, b) {
      if (a.term.toLowerCase() < b.term.toLowerCase()) {
        return -1;
      }
      if (a.term.toLowerCase() > b.term.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    const id = match.params.id;
    dispatch(setSet(id)).then(() => dispatch(getAllFlashcards(id)));
  }, []);

  useEffect(() => {
    if (
      selectedSet &&
      Object.keys(selectedSet).length === 0 &&
      selectedSet.constructor === Object
    ) {
      history.push("/");
    } else if (selectedSet) {
      setLoading(false);
    }
  }, [selectedSet]);

  const prevFlashcardsRef = useRef();

  useEffect(() => {
    if (allFlashcards && allFlashcards.length) {
      const dataSorted = sortData(allFlashcards);
      setDataFiltered(dataSorted);
      const prevSets = prevFlashcardsRef.current;
      if (prevSets !== allFlashcards) {
        const dataSorted = sortData(allFlashcards);
        setDataFiltered(dataSorted);
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
    return dispatch(deleteFlashcard(selectedSet.id, id)).then(() => {
      dispatch(getUserSets());
      dispatch(getPublicSets());
    });
  };

  const onSearch = (e) => {
    const val = e.target.value;
    setDataFiltered(
      allFlashcards.filter((card) => {
        if (
          card.term.toLowerCase().includes(val.toLowerCase()) ||
          card.definition.toLowerCase().includes(val.toLowerCase())
        ) {
          return card;
        }
      })
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
    if (user && user.sets && user.sets.includes(selectedSet.id)) {
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
    <Layout className="content-layout">
      <FlashcardListModal
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        action={modalEditAction}
      />
      <PageHeader
        title={pageHeaderTitle()}
        className="content-page-header"
        extra={renderActions()}
      />
      <Content className="content">
        {loading ? (
          <Loading />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={dataFiltered}
            className="list"
            locale={{ emptyText: "No flashcards." }}
            renderItem={(item) => (
              <List.Item
                actions={
                  user &&
                  user.sets &&
                  user.sets.includes(selectedSet.id) && [
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
    </Layout>
  );
};

export default FlashcardList;
