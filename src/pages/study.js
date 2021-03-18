import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Button,
  PageHeader,
  Progress,
  Layout,
  Typography,
  Breadcrumb,
} from "antd";
import Loading from "../components/loading";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Content, Header, Footer } = Layout;
const { Text, Title } = Typography;
import { getAllFlashcards } from "../redux/actions/flashcards";
import { setSet } from "../redux/actions/sets";
import SessionService from "../services/session-service";

const Sets = ({ match }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [shuffledFlashcards, setShuffledFlashcards] = useState(null);
  const [progressIndex, setProgressIndex] = useState(null);
  const { selectedSet } = useSelector((state) => state.sets);
  const { allFlashcards } = useSelector((state) => state.flashcards);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardTransitioning, setCardTransitioning] = useState(false);
  const [finished, setFinished] = useState(false);
  const history = useHistory();

  const cardRef = useRef(null);

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

  useEffect(() => {
    focusCard();
  });

  const focusCard = () => {
    if (cardRef && cardRef.current) {
      cardRef.current.focus();
    }
  };

  useEffect(() => {
    if (
      selectedSet &&
      Object.keys(selectedSet).length === 0 &&
      selectedSet.constructor === Object
    ) {
      history.push("/");
    }
  }, [selectedSet]);

  const shuffleFlashcards = (flashcards) => {
    const shuffled = flashcards.sort(() => Math.random() - 0.5);
    setShuffledFlashcards([...shuffled]);
    setCurrentFlashcard({ ...shuffled[0] });
    setProgressIndex(0);
  };

  useEffect(() => {
    const setId = match.params.id;
    dispatch(setSet(setId)).then(() => dispatch(getAllFlashcards(setId)));
  }, []);

  useEffect(async () => {
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

  const navigateCards = async (direction = "next") => {
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

  const renderTerm = () => {
    if (!finished)
      return (
        <div className="flip-card-term flip-card-term-active">
          <Title level={4}>{`${currentFlashcard.term}`}</Title>
          <div className="study-content-banner">Click the card to flip!</div>
        </div>
      );
    return (
      <div className="flip-card-term flip-card-finished">
        <Title level={4}>{`Great job! You just finished studying ${
          allFlashcards.length
        } card${allFlashcards.length > 1 ? "s" : ""}!`}</Title>
        <div className="flip-card-finished-action">
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
      <div className="flip-card-definition">
        <Title level={4}>{`${currentFlashcard.definition}`}</Title>
        <div className="study-content-banner">Click the card to flip!</div>
      </div>
    );
  };

  return (
    <Layout className="content-layout">
      <PageHeader
        title={renderPageHeaderTitle()}
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
                    percent={100 * ((progressIndex + 1) / allFlashcards.length)}
                    showInfo={false}
                  />
                  <Text>{`${progressIndex + 1}/${allFlashcards.length}`}</Text>
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
                    className="flip-card-inner"
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
          </Layout>
        )}
      </Content>
    </Layout>
  );
};

export default Sets;
