import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllFlashcards } from "../redux/actions/flashcards";
import { setSet } from "../redux/actions/sets";
import SessionService from "../services/session-service";
import Loading from "../components/loading";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  Button,
  PageHeader,
  Progress,
  Layout,
  Typography,
  Breadcrumb,
} from "antd";
const { Content, Header, Footer } = Layout;
const { Text, Title } = Typography;

const Sets = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [shuffledFlashcards, setShuffledFlashcards] = useState(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [cardTransitioning, setCardTransitioning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [progressIndex, setProgressIndex] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);

  const { selectedSet } = useSelector((state) => state.sets);
  const { allFlashcards } = useSelector((state) => state.flashcards);

  const cardRef = useRef(null);
  useEffect(() => {
    focusCard();
  });

  const focusCard = () => {
    if (cardRef && cardRef.current) {
      cardRef.current.focus();
    }
  };

  useEffect(() => {
    const setId = match.params.id;
    dispatch(setSet(setId))
      .then(() => dispatch(getAllFlashcards(setId)))
      .catch(() => history.push("/"));
  }, []);

  useEffect(async () => {
    if (allFlashcards && !allFlashcards.length) history.push("/");
    if (allFlashcards) {
      const setId = match.params.id;
      const cachedFlashcardOrder = await SessionService.getFlashcardOrder(
        setId
      );
      const cachedProgressIndex = await SessionService.getFlashcardProgress(
        setId
      );
      if (
        cachedFlashcardOrder &&
        cachedFlashcardOrder.length === allFlashcards.length
      ) {
        const flashcardsOrdered = Object.values(
          cachedFlashcardOrder
        ).map((id) => allFlashcards.find((flashcard) => flashcard.id === id));
        setShuffledFlashcards(flashcardsOrdered);
        setProgressIndex(
          cachedProgressIndex && cachedProgressIndex < allFlashcards.length - 1
            ? cachedProgressIndex
            : 0
        );
      } else {
        shuffleFlashcards(allFlashcards);
      }
    }
  }, [allFlashcards]);

  useEffect(() => {
    if (shuffledFlashcards) {
      const setId = match.params.id;
      const orderedFlashcards = shuffledFlashcards.map(
        (flashcard) => flashcard.id
      );
      SessionService.saveFlashcardOrder(setId, orderedFlashcards);
    }
  }, [shuffledFlashcards]);

  useEffect(() => {
    if (progressIndex !== null) {
      const setId = match.params.id;
      SessionService.saveFlashcardProgress(setId, progressIndex);
      setCurrentFlashcard(shuffledFlashcards[progressIndex]);
      setLoading(false);
    }
  }, [progressIndex]);

  useLayoutEffect(() => {
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

  const shuffleFlashcards = (flashcards) => {
    const shuffled = flashcards.sort(() => Math.random() - 0.5);
    setShuffledFlashcards([...shuffled]);
    setCurrentFlashcard({ ...shuffled[0] });
    setProgressIndex(0);
  };

  const navigateCards = async (direction) => {
    setCardTransitioning(true);
    if (direction === "next" && progressIndex < shuffledFlashcards.length) {
      if (progressIndex + 1 >= shuffledFlashcards.length) {
        setCardFlipped(false);
        setCardTransitioning(false);
        return setFinished(true);
      }
      setCurrentFlashcard({
        ...shuffledFlashcards[progressIndex + 1],
      });
      setProgressIndex(progressIndex + 1);
    }
    if (direction === "prev" && progressIndex > 0) {
      setCurrentFlashcard({
        ...shuffledFlashcards[progressIndex - 1],
      });
      setProgressIndex(progressIndex - 1);
    }
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

  const renderPageHeaderTitle = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Flashcard sets</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/${(selectedSet && selectedSet.id) || ""}`}>{`${
            (selectedSet && selectedSet.name) || ""
          }`}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={"/"}>Study</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  const renderTerm = () => {
    if (!finished)
      return (
        <div className="study-card-term study-card-term-active">
          <Title level={4}>{`${currentFlashcard.term}`}</Title>
          <div className="study-card-banner">Click the card to flip!</div>
        </div>
      );
    return (
      <div className="study-card-term study-card-finished">
        <Title level={4}>{`Great job! You just finished studying ${
          allFlashcards.length
        } card${allFlashcards.length > 1 ? "s" : ""}!`}</Title>
        <div className="study-card-finished-action">
          <Button
            key="1"
            type="secondary"
            onClick={() => resetCards(allFlashcards)}
          >
            Start again
          </Button>
          <Button key="2" type="primary" onClick={() => history.push("/")}>
            Done for now
          </Button>
        </div>
      </div>
    );
  };

  const renderDefinition = () => {
    return (
      <div className="study-card-definition">
        <Title level={4}>{`${currentFlashcard.definition}`}</Title>
        <div className="study-card-banner">Click the card to flip!</div>
      </div>
    );
  };

  return loading || !allFlashcards ? (
    <Loading />
  ) : (
    <Content className="content">
      <Layout className="study-layout">
        <PageHeader
          title={renderPageHeaderTitle()}
          className="content-header"
        />
        <Header className="study-card-header">
          <div className="study-card-progress">
            <Text>Progress</Text>
            <Progress
              percent={100 * ((progressIndex + 1) / allFlashcards.length)}
              showInfo={false}
            />
            <Text>{`${progressIndex + 1}/${allFlashcards.length}`}</Text>
          </div>
          {!finished && (
            <Button
              type="secondary"
              onClick={() => shuffleFlashcards(allFlashcards)}
            >
              Shuffle
            </Button>
          )}
        </Header>
        {!cardTransitioning && (
          <div
            className={`study-card ${
              cardFlipped &&
              !cardTransitioning &&
              !finished &&
              "study-card-animated"
            }`}
          >
            <div
              className="study-card-inner"
              onClick={() => flipCard()}
              onKeyDown={(e) => handleKeyPress(e)}
              onBlur={() => focusCard()}
              ref={cardRef}
              tabIndex={0}
              role="button"
            >
              {renderTerm()}
              {renderDefinition()}
            </div>
          </div>
        )}
        {!finished && (
          <Footer
            className="study-card-action"
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
              disabled={!progressIndex}
            />
            <Button
              key="2"
              type="secondary"
              icon={<RightOutlined />}
              onClick={() => navigateCards("next")}
              disabled={progressIndex === allFlashcards.length}
            />
          </Footer>
        )}
      </Layout>
    </Content>
  );
};

export default Sets;
