import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, PageHeader, Progress, Layout, Typography } from "antd";
import Loading from "../components/loading";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Content, Header, Footer } = Layout;
const { Text, Title } = Typography;
import {
  getAllFlashcards,
  clearAllFlashcards,
} from "../redux/actions/flashcards";

import { getUserSets, setSet } from "../redux/actions/sets";

const Sets = ({ match }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const { selectedSet, allSets } = useSelector((state) => state.sets);
  const { allFlashcards } = useSelector((state) => state.flashcards);
  const [currentFlashcard, setCurrentFlashcard] = useState({});
  const [cardFlipped, setCardFlipped] = useState(true);
  const [cardTransitioning, setCardTransitioning] = useState(false);
  const [finished, setFinished] = useState(false);
  const history = useHistory();

  const cardRef = useRef(null);

  useEffect(() => {
    focusCard();
  });

  const focusCard = () => {
    if (cardRef && cardRef.current) {
      cardRef.current.focus();
    }
  };

  const shuffleFlashcards = (flashcards) => {
    const shuffled = flashcards.sort(() => Math.random() - 0.5);
    setCurrentFlashcard({ ...shuffled[0], index: 0 });
    return shuffled;
  };

  useEffect(() => {
    setLoading(true);
    dispatch(clearAllFlashcards());
  }, []);

  useEffect(() => {
    const id = match.params.id;
    if (!allSets.length) {
      dispatch(getUserSets());
    }
    if (allSets.length) {
      dispatch(getAllFlashcards(id));
    }
    const set = allSets.find((set) => set.id === id) || {};
    dispatch(setSet(set));
  }, [allSets]);

  useLayoutEffect(() => {
    if (allFlashcards.length) {
      setShuffledFlashcards(shuffleFlashcards(allFlashcards));
      setLoading(false);
    }
  }, [allFlashcards]);

  const renderPageHeaderTitle = () => {
    return (
      <>
        <Link to={"/"}>Flashcard sets</Link>
        {" > "}
        <Link to={`/set/${selectedSet.id || ""}`}>{`${
          selectedSet.name || ""
        }`}</Link>
        {" > "}
        Study
      </>
    );
  };

  const navigateCards = async (direction = "next") => {
    if (currentFlashcard.index === allFlashcards.length) return;
    setCardTransitioning(true);
    if (
      direction === "next" &&
      currentFlashcard.index < shuffledFlashcards.length
    ) {
      setCurrentFlashcard({
        ...shuffledFlashcards[currentFlashcard.index + 1],
        index: currentFlashcard.index + 1,
      });
    }
    if (direction === "prev" && currentFlashcard.index > 0) {
      setCurrentFlashcard({
        ...shuffledFlashcards[currentFlashcard.index - 1],
        index: currentFlashcard.index - 1,
      });
    }
  };

  useLayoutEffect(() => {
    if (
      allFlashcards.length &&
      currentFlashcard.index === allFlashcards.length
    ) {
      setFinished(true);
    }
    if (cardTransitioning) {
      setCardFlipped(false);
      setCardTransitioning(false);
    }
  }, [currentFlashcard]);

  const flipCard = () => {
    setCardFlipped(!cardFlipped);
  };

  const resetCards = () => {
    setCardTransitioning(true);
    shuffleFlashcards(allFlashcards);
    setFinished(false);
  };

  const handleKeyPress = (e) => {
    if (e.code === "Space") {
      flipCard();
    }
    if (e.code === "ArrowRight") {
      navigateCards("next");
    }
    if (e.code === "ArrowLeft") {
      navigateCards("prev");
    }
  };

  const renderFront = () => {
    if (!finished)
      return (
        <div className="flip-card-front flip-card-front-active">
          <Title>{`${currentFlashcard.front}`}</Title>
          <div className="study-content-banner">Click the card to flip!</div>
        </div>
      );
    return (
      <div className="flip-card-front flip-card-finished">
        <img
          alt="celebrate"
          src="https://media1.giphy.com/media/Wwf1CGft6dW0V97FWe/source.gif"
        />
        <Title>{`Great job! You just finished studying ${allFlashcards.length} cards!`}</Title>
        <div className="flip-card-finished-action">
          <Button
            key="1"
            type="secondary"
            onClick={() => resetCards(allFlashcards)}
          >
            Start again
          </Button>
          <Button key="2" type="primary" onClick={() => history.push(`/`)}>
            Done for now
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Layout className="content-layout">
      <PageHeader
        title={renderPageHeaderTitle(name)}
        className="content-page-header"
      />
      <Content className="content">
        {loading ? (
          <Loading />
        ) : (
          <Layout className="study-layout">
            <Layout className="study">
              <Header className="study-header">
                <div className="study-progress">
                  <Text>Progress</Text>
                  <Progress
                    percent={
                      100 * (currentFlashcard.index / allFlashcards.length)
                    }
                    showInfo={false}
                  />
                  <Text>{`${currentFlashcard.index}/${allFlashcards.length}`}</Text>
                </div>
                <div className="study-header-action">
                  {!finished && (
                    <Button
                      type="secondary"
                      onClick={() => shuffleFlashcards(allFlashcards)}
                    >
                      Shuffle
                    </Button>
                  )}
                </div>
              </Header>
              {!cardTransitioning && (
                <Content
                  className={`study-content ${
                    cardFlipped &&
                    !cardTransitioning &&
                    !finished &&
                    "study-content-animated"
                  }`}
                >
                  <div
                    className="flip-card-inner "
                    onClick={() => flipCard()}
                    onKeyDown={(e) => handleKeyPress(e)}
                    onBlur={() => focusCard()}
                    ref={cardRef}
                    tabIndex={0}
                    role="button"
                  >
                    {renderFront()}

                    <div className="flip-card-back">
                      <Title>{`${currentFlashcard.back}`}</Title>
                      <div className="study-content-banner">
                        Click the card to flip!
                      </div>
                    </div>
                  </div>
                </Content>
              )}
              {!finished && (
                <Footer
                  className="study-footer"
                  onClick={(e) => e.stopPropagation()}
                  role="button"
                  onKeyDown={(e) => e.stopPropagation()}
                  tabIndex={0}
                >
                  <Button
                    key="1"
                    type="secondary"
                    icon={<LeftOutlined />}
                    onClick={() => navigateCards("prev")}
                    disabled={!currentFlashcard.index}
                  />
                  <Button
                    key="2"
                    type="secondary"
                    icon={<RightOutlined />}
                    onClick={() => navigateCards("next")}
                    disabled={currentFlashcard.index === allFlashcards.length}
                  />
                </Footer>
              )}
            </Layout>
          </Layout>
        )}
      </Content>
    </Layout>
  );
};

export default Sets;
