import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Spin, Input, PageHeader, Button, List } from "antd";
import FCListModal from "../components/fc-list-modal";
import DeleteConfirm from "../components/delete-confirm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  getAllFlashcards,
  setFlashcard,
  clearAllFlashcards,
  deleteFlashcard,
} from "../redux/actions/flashcards";
import { setSet, getAllSets } from "../redux/actions/sets";

const { Content } = Layout;

const FCList = ({ match }) => {
  const dispatch = useDispatch();
  const { allFlashcards } = useSelector((state) => state.flashcards);
  const { selectedSet, allSets } = useSelector((state) => state.sets);
  const [loading] = useState(false);
  const [dataFiltered, setDataFiltered] = useState([]);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditAction, setModalEditAction] = useState(null);

  const sortData = (data) => {
    return data.sort(function (a, b) {
      if (a.front < b.front) {
        return -1;
      }
      if (a.front > b.front) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    const id = match.params.id;
    if (!allSets.length) {
      dispatch(getAllSets());
    }
    if (allSets.length) {
      dispatch(getAllFlashcards(id));
    }
    const set = allSets.find((set) => set.id === id) || {};
    dispatch(setSet(set));
  }, [allSets]);

  useEffect(() => {
    dispatch(clearAllFlashcards());
  }, []);

  useEffect(() => {
    const dataSorted = sortData(allFlashcards);
    setDataFiltered(dataSorted);
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
        <Link to={"/"}>Flashcard Sets</Link>
        {" > "}
        {selectedSet.name}
      </>
    );
  };

  const handleDelete = async (id) => {
    dispatch(deleteFlashcard(selectedSet.id, id)).then(() =>
      dispatch(getAllSets())
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

export default FCList;
